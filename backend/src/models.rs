use diesel::prelude::*;
use serde::{Deserialize, Deserializer, Serialize, Serializer};
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
    pub auth_object: ClientAuthObject,
    pub recipient_id: String,
}

#[derive(Deserialize)]
pub struct KeyExchangeMessage {
    pub auth_object: InitialClientAuth,
    pub client_key: String,
}

#[derive(Deserialize)]
pub struct InitialClientAuth {
    pub email: String,
    pub password: String,
}

#[derive(Deserialize)]
pub struct ClientAuthObject {
    pub email: String,
    pub password: String,
    pub app_key: String,
}

#[derive(Deserialize)]
pub struct MessageFetchPayload {
    pub auth_object: ClientAuthObject,
    pub up_to: i8,
    pub recipient_id: String,
}

#[derive(Deserialize)]
pub struct SentMessage {
    pub message_body: String,
    pub recipient_id: String,
}
impl SentMessage {
    pub fn new(message_body: String, recipient_id: String) -> SentMessage {
        SentMessage {
            message_body,
            recipient_id,
        }
    }

    pub fn contents(&self) -> &String {
        &self.message_body
    }
}

pub fn serialize_dt<S>(dt: &chrono::NaiveDateTime, serializer: S) -> Result<S::Ok, S::Error>
where
    S: Serializer,
{
    dt.format("%d/%m/%Y %H:%M")
        .to_string()
        .serialize(serializer)
}
fn deserialize_dt<'de, D>(deserializer: D) -> Result<chrono::NaiveDateTime, D::Error>
where
    D: Deserializer<'de>,
{
    let s: &str = Deserialize::deserialize(deserializer)?;

    // Parse the string into a NaiveDateTime using the format you specified
    match chrono::NaiveDateTime::parse_from_str(s, "%d/%m/%Y %H:%M") {
        Ok(dt) => Ok(dt),
        Err(_) => Err(serde::de::Error::custom("Failed to parse NaiveDateTime")),
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

#[derive(Deserialize, Serialize, Queryable, Selectable, Insertable)]
#[diesel(table_name = crate::schema::sent_messages)]
#[diesel(check_for_backend(diesel::mysql::Mysql))]
pub struct StoredMessage {
    pub id: String,
    pub message_body: String,
    pub sender_id: String,
    pub recipient_id: String,
    #[serde(serialize_with = "serialize_dt", deserialize_with = "deserialize_dt")]
    pub time: chrono::NaiveDateTime,
}
