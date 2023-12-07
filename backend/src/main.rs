mod send_message;
use axum::{
    routing::{get, post},
    Router
};
use send_message::{
    echo,
    create_user,
    socket_handler, ws_handler
};

#[tokio::main]
async fn main() {
    let app = Router::new()
                        .route("/", get(|| async { "Hello, World!" }))
                        .route("/echo", get(echo))
                        .route("/hello_world", post(create_user))
                        .route("/web_socket_test", get(ws_handler));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}