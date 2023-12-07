use std::net::SocketAddr;

use axum::{body::Bytes, http::StatusCode, Json, extract::ws::{Message, WebSocket, WebSocketUpgrade}};
use serde::Deserialize;
use axum::{
    response::IntoResponse,
    routing::get,
    Router,
};
use axum_extra::TypedHeader;

use std::borrow::Cow;
use std::ops::ControlFlow;
use std::path::PathBuf;
use tower_http::{
    services::ServeDir,
    trace::{DefaultMakeSpan, TraceLayer},
};

use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

//allows to extract the IP of connecting user
use axum::extract::connect_info::ConnectInfo;
use axum::extract::ws::CloseFrame;

//allows to split the websocket stream into separate TX and RX branches
use futures::{sink::SinkExt, stream::StreamExt};


pub async fn echo(body: Bytes) -> Result<String, StatusCode> {
    if let Ok(string) = String::from_utf8(body.to_vec()) {
        Ok(string)
    } else {
        Err(StatusCode::BAD_REQUEST)
    }
}

#[derive(Deserialize)]
pub struct create_user {
    email: String,
    name: String
}

pub async fn create_user(Json(payload): Json<create_user>) -> Result<String, StatusCode> {
    if payload.email == "helloWOrld" {
        Ok(payload.email)
    } else {
        Err(StatusCode::BAD_REQUEST)
    }
}


pub async fn ws_handler(
    ws: WebSocketUpgrade,
    user_agent: Option<TypedHeader<headers::UserAgent>>,
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
) -> impl IntoResponse {
    let user_agent = if let Some(TypedHeader(user_agent)) = user_agent {
        user_agent.to_string()
    } else {
        String::from("Unknown browser")
    };
    println!("`{user_agent}` at {addr} connected.");
    // finalize the upgrade process by returning upgrade callback.
    // we can customize the callback by sending additional info such as address.
    ws.on_upgrade(move |socket| socket_handler(socket, addr))
}

pub async fn socket_handler(mut socket: WebSocket, who: SocketAddr) {
    if socket.send(Message::Ping(vec![1, 2, 3])).await.is_ok() {
        println!("Pinged something");
    }


    if let Some(msg) = socket.recv().await {
        if let Ok(msg) = msg {
            println!("Message recieved");
        } else {
            println!("client {who} abruptly disconnected");
            return;
        }
    }
}