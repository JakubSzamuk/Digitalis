use std::{
    collections::HashSet,
    sync::{Arc, Mutex},
};

use axum::{
    extract::{
        ws::{Message, WebSocket},
        WebSocketUpgrade,
        State
    },
    response::Response,
    routing::get,
    Router,
};

use tokio::sync::broadcast;
use futures::{Sink, SinkExt, Stream, StreamExt};
struct AppState {
    tx: broadcast::Sender<String>,
    users: Mutex<HashSet<String>>
}



#[tokio::main]
async fn main() {
    let listener = tokio::net::TcpListener::bind("127.0.0.1:8080")
        .await
        .unwrap();
    println!("listening on {}", listener.local_addr().unwrap());
    axum::serve(listener, app()).await.unwrap();
}

fn app() -> Router {
    let users = Mutex::new(HashSet::new());
    let (tx, _rx) = broadcast::channel(100);

    let app_state = Arc::new(AppState { users, tx });
    Router::new()
        .route("/messages", get(message_handler))
        .with_state(app_state)
}



async fn message_handler(ws: WebSocketUpgrade, State(state): State<Arc<AppState>>) -> Response {
    ws.on_upgrade(|socket| message_socket_handler(socket, state))
}

async fn message_socket_handler(mut socket: WebSocket, state: Arc<AppState>) {
    let (mut sender, mut reciever) = socket.split();
    
    let mut username = String::new();
    
    while let Some(Ok(msg)) = reciever.next().await {
        if let Message::Text(name) = msg {
            check_username(&state, &mut username, &name);

            if !username.is_empty() {
                break
            } else {
                let _ = sender
                            .send(Message::Text(String::from("Username is already taken.")))
                            .await;
                return;
            }
        }
    }


    let mut rx = state.tx.subscribe();

    let msg = format!("{username} joined.");
    tracing::debug!("{msg}");
    let _ = state.tx.send(msg);


    let mut send_task = tokio::spawn(async move {
        while let Ok(msg) = rx.recv().await {
            if sender.send(Message::Text(msg)).await.is_err() {
                break;
            }
        }
    });
    


    let tx = state.tx.clone();
    let name = username.clone();

    let mut recv_task = tokio::spawn(async move {
        while let Some(Ok(Message::Text(text))) = reciever.next().await {
            let _ = tx.send(format!("{name} $$  {text}"));
        }
    });

    tokio::select! {
        _ = (&mut send_task) => recv_task.abort(),
        _ = (&mut recv_task) => send_task.abort(),
    }

}



fn check_username(state: &AppState, string: &mut String, name: &str) {
    let mut user_set = state.users.lock().unwrap();

    if !user_set.contains(name) {
        user_set.insert(name.to_owned());

        string.push_str(name);
    }
}