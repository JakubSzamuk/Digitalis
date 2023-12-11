mod helpers;
pub mod models;
pub mod schema;

use std::{
    collections::HashSet,
    sync::{Arc, Mutex},
};

use axum::{
    extract::{
        ws::{Message, WebSocket},
        State, WebSocketUpgrade,
    },
    response::Response,
    routing::get,
    Router,
};

use futures::{SinkExt, StreamExt};
use tokio::sync::broadcast;

use crate::{
    helpers::message_processor,
    models::{SentMessage, StoredMessage},
};

#[tokio::main]
async fn main() {
    let listener = tokio::net::TcpListener::bind("0.0.0.0:5000").await.unwrap();
    println!("listening on {}", listener.local_addr().unwrap());
    axum::serve(listener, app()).await.unwrap();
}

fn app() -> Router {
    let users = Mutex::new(HashSet::new());
    let (tx, _rx) = broadcast::channel(100);

    let app_state = Arc::new(models::AppState::new(users, tx));
    Router::new()
        .route("/fetch-messages", get())
        .route("/messages", get(message_handler))
        .with_state(app_state)
}

async fn message_fetch_handler() -> Vec<SentMessage> {}

async fn message_handler(
    ws: WebSocketUpgrade,
    State(state): State<Arc<models::AppState>>,
) -> Response {
    ws.on_upgrade(|socket| message_socket_handler(socket, state))
}

async fn message_socket_handler(mut socket: WebSocket, state: Arc<models::AppState>) {
    let (mut sender, mut reciever) = socket.split();

    while let Some(Ok(msg)) = reciever.next().await {
        if let Message::Text(unparse_auth_obj) = msg {
            let auth_object: Result<models::InitialMessage, serde_json::Error> =
                serde_json::from_str(&unparse_auth_obj);

            match auth_object {
                Ok(result) => {
                    if helpers::verify_auth(result) {
                        break;
                    } else {
                        let _ = sender
                            .send(Message::Text(String::from("Incorrect Credentials")))
                            .await;
                        return;
                    }
                }
                Err(_) => {
                    let _ = sender
                        .send(Message::Text(String::from("Invalid Request format")))
                        .await;
                    return;
                }
            }
        }
    }

    let mut rx = state.tx.subscribe();

    let mut send_task = tokio::spawn(async move {
        while let Ok(msg) = rx.recv().await {
            if sender.send(Message::Text(msg)).await.is_err() {
                break;
            }
        }
    });

    let tx = state.tx.clone();
    // let name = username.clone();

    let mut recv_task = tokio::spawn(async move {
        while let Some(Ok(Message::Text(unparsed_message))) = reciever.next().await {
            let serialised_message: SentMessage = serde_json::from_str(&unparsed_message).unwrap();
            let saved_message: StoredMessage = message_processor(serialised_message);
            let _ = tx.send(serde_json::to_string(&saved_message).unwrap());
        }
    });

    tokio::select! {
        _ = (&mut send_task) => recv_task.abort(),
        _ = (&mut recv_task) => send_task.abort(),
    }
}
