use diesel::prelude::*;
use serde::Deserialize;
use std::{collections::HashSet, sync::Mutex};
use tokio::sync::broadcast;

pub struct AppState {
    pub tx: broadcast::Sender<String>,
    users: Mutex<HashSet<String>>,
}

impl AppState {
    pub fn new(users: Mutex<HashSet<String>>, tx: broadcast::Sender<String>) -> AppState {
        AppState { users, tx }
    }
    pub fn get_users(&self) -> &Mutex<HashSet<String>> {
        &self.users
    }
}

#[derive(Deserialize)]
pub struct InitialMessage {
    pub email: String,
    pub password: String,
    pub app_key: String,
}
#[derive(Deserialize)]
pub struct SentMessage {
    message_body: String,
    sender_id: String,
}
impl SentMessage {
    pub fn new(message_body: String, sender_id: String) -> SentMessage {
        SentMessage {
            message_body,
            sender_id,
        }
    }

    pub fn contents(&self) -> &String {
        &self.message_body
    }
    pub fn sender(&self) -> &String {
        &self.sender_id
    }
}

#[derive(Queryable, Selectable, Insertable)]
#[diesel(table_name = crate::schema::users)]
#[diesel(check_for_backend(diesel::mysql::Mysql))]
pub struct User {
    pub id: i32,
    pub email: String,
    pub password: String,
}

#[derive(Queryable, Selectable, Insertable)]
#[diesel(table_name = crate::schema::app_keys)]
#[diesel(check_for_backend(diesel::mysql::Mysql))]
pub struct AppKey {
    pub id: i32,
    pub app_key: String,
}
