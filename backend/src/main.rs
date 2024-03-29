mod helpers;
pub mod models;
pub mod schema;

use core::panic;
use std::{
    collections::HashSet,
    sync::{Arc, Mutex},
};

use axum::{
    extract::{
        ws::{Message, WebSocket},
        State, WebSocketUpgrade,
    },
    http::StatusCode,
    response::Response,
    routing::{get, post},
    Json, Router,
};

use chrono::naive::serde;
use futures::{SinkExt, StreamExt};
use helpers::client_key_gen;
use models::CredentialResponse;
use tokio::sync::broadcast;

use crate::{helpers::message_processor, models::{StoredMessage, SentMessage, RecipientChangeMessage, MessageVecProcessor}};

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
        .route("/configure-client", post(client_app_key_handler))
        .route("/messages", get(message_handler))
        .with_state(app_state)
}

async fn client_app_key_handler(
    Json(payload): Json<models::AppKeyExchangePayload>,
) -> axum::response::Result<Json<CredentialResponse>> {
    let key_result = client_key_gen(payload.auth_object, payload.app_key);

    if let Ok(final_key) = key_result {
        return Ok(Json(final_key));
    }

    Err(StatusCode::INTERNAL_SERVER_ERROR.into())
}

async fn message_handler(
    ws: WebSocketUpgrade,
    State(state): State<Arc<models::AppState>>,
) -> Response {
    ws.on_upgrade(|socket| message_socket_handler(socket, state))
}

async fn message_socket_handler(socket: WebSocket, state: Arc<models::AppState>) {
    let (mut sender, mut reciever) = socket.split();

    let mut user_object: models::User = Default::default();

    while let Some(Ok(msg)) = reciever.next().await {
        if let Message::Text(unparse_auth_obj) = msg {
            let intial_deserialisation: Result<models::ClientAuthObject, serde_json::Error> =
                serde_json::from_str(&unparse_auth_obj);

            match intial_deserialisation {
                Ok(result) => {
                    if let Ok(temp_user_object) = helpers::verify_auth(result) {
                        user_object = temp_user_object;
                        let _ = sender.send(Message::Text(String::from("Login Successful"))).await;
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
        } else {
            return;
        }
    }
    let mut recipient_id = Arc::new(Mutex::new("".to_string()));


    let mut rx = state.tx.subscribe();

    let recipient_id_clone = recipient_id.clone();


    let mut send_task = tokio::spawn(async move {
        while let Ok(msg) = rx.recv().await {            
            if helpers::message_is_for_user(
                &msg.to_string(),
                &user_object.id.to_string(),
                recipient_id.lock().unwrap().to_string(),
            ) {
                if sender.send(Message::Text(msg)).await.is_err() {
                    break;
                }
            } else if let Ok(serialised_struct) = serde_json::from_str::<MessageVecProcessor>(&msg.to_string()) {
                if serialised_struct.user_id == user_object.id {
                    if sender.send(Message::Text(serde_json::to_string(&serialised_struct.message_vec).unwrap())).await.is_err() {
                        break;
                    }
                }
            }
        }
    });



    
    let tx = state.tx.clone();

    let mut recv_task = tokio::spawn(async move {
        while let Some(Ok(Message::Text(unparsed_message))) = reciever.next().await {
            if let Ok(serialised_message) = serde_json::from_str::<SentMessage>(&unparsed_message) {
                let saved_message: StoredMessage =
                    message_processor(serialised_message, &user_object);
                let _ = tx.send(serde_json::to_string(&saved_message).unwrap());
            } else if let Ok(serialised_message) = serde_json::from_str::<RecipientChangeMessage>(&unparsed_message) {
                let messages: diesel::result::QueryResult<Vec<StoredMessage>> = helpers::fetch_message_vec(
                    serialised_message.up_to,
                    &user_object,
                    &serialised_message.new_recipient_id,
                );
                *recipient_id_clone.lock().unwrap() = serialised_message.new_recipient_id;
        
                if let Ok(message_vec) = messages {
                    let _ = tx.send(serde_json::to_string(&MessageVecProcessor { message_vec: message_vec.clone(), user_id: user_object.id.clone() }).unwrap()).unwrap();
                }
            }
        }
    });

    tokio::select! {
        _ = (&mut send_task) => recv_task.abort(),
        _ = (&mut recv_task) => send_task.abort(),
    }
}
