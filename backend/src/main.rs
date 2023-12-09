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

use diesel::MysqlConnection;
use futures::{SinkExt, StreamExt};
use tokio::sync::broadcast;

use crate::{helpers::create_user, models::SentMessage};

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
        .route("/Hello", get(|| async { "Hello world" }))
        .route("/messages", get(message_handler))
        .with_state(app_state)
}

const APP_KEYS: [&str; 2] = [
    "1f6f284bb1732cc92fa1a7ebccf1b13b387a41aee7adc71265892e57b7111b8a",
    "32f56366c7b932a2ff948a7fbc2a680dcb88ed29cdfbc6ff2ddeb749070a7af2",
];

async fn message_handler(
    ws: WebSocketUpgrade,
    State(state): State<Arc<models::AppState>>,
) -> Response {
    ws.on_upgrade(|socket| message_socket_handler(socket, state))
}

async fn message_socket_handler(mut socket: WebSocket, state: Arc<models::AppState>) {
    let (mut sender, mut reciever) = socket.split();

    while let Some(Ok(msg)) = reciever.next().await {
        if let Message::Text(unparseAuthObj) = msg {
            let auth_object: models::InitialMessage =
                serde_json::from_str(&unparseAuthObj).unwrap();
            if helpers::verify_auth(auth_object) {
                break;
            } else {
                let _ = sender
                    .send(Message::Text(String::from("Incorrect Credentials")))
                    .await;
                return;
            }
        }
    }

    let mut rx = state.tx.subscribe();

    // let msg = format!("");
    // tracing::debug!("{msg}");
    // let _ = state.tx.send(msg);

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
        while let Some(Ok(Message::Text(unparseMessage))) = reciever.next().await {
            let serialised_message: SentMessage = serde_json::from_str(&unparseMessage).unwrap();
            let _ = tx.send(format!("{name} $$  {text}"));
        }
    });

    tokio::select! {
        _ = (&mut send_task) => recv_task.abort(),
        _ = (&mut recv_task) => send_task.abort(),
    }
}
