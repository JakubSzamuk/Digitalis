use diesel::{prelude::*, sql_types::Datetime};
use serde::{Deserialize, Serialize, Serializer};
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
pub struct MessageFetchPayload {
    pub auth_object: InitialMessage,
    pub up_to: i8,
    pub sender_id: String,
    pub recipient_id: String,
}

#[derive(Deserialize)]
pub struct SentMessage {
    pub message_body: String,
    pub sender_id: String,
    pub recipient_id: String,
}
impl SentMessage {
    pub fn new(message_body: String, sender_id: String, recipient_id: String) -> SentMessage {
        SentMessage {
            message_body,
            sender_id,
            recipient_id,
        }
    }

    pub fn contents(&self) -> &String {
        &self.message_body
    }
    pub fn sender(&self) -> &String {
        &self.sender_id
    }
}

pub fn serialize_dt<S>(dt: &chrono::NaiveDateTime, serializer: S) -> Result<S::Ok, S::Error>
where
    S: Serializer,
{
    dt.format("%m/%d/%Y %H:%M")
        .to_string()
        .serialize(serializer)
}

#[derive(Queryable, Selectable, Insertable)]
#[diesel(table_name = crate::schema::users)]
#[diesel(check_for_backend(diesel::mysql::Mysql))]
pub struct User {
    pub id: i32,
    pub email: String,
    pub password: String,
}

impl Default for User {
    fn default() -> Self {
        User {
            id: 65535,
            email: "init".to_string(),
            password: "init".to_string(),
        }
    }
}

#[derive(Queryable, Selectable, Insertable)]
#[diesel(table_name = crate::schema::app_keys)]
#[diesel(check_for_backend(diesel::mysql::Mysql))]
pub struct AppKey {
    pub id: i32,
    pub app_key: String,
}

#[derive(Serialize, Queryable, Selectable, Insertable)]
#[diesel(table_name = crate::schema::sent_messages)]
#[diesel(check_for_backend(diesel::mysql::Mysql))]
pub struct StoredMessage {
    pub message_body: String,
    pub sender_id: String,
    pub recipient_id: String,
    #[serde(serialize_with = "serialize_dt")]
    pub time: chrono::NaiveDateTime,
}
