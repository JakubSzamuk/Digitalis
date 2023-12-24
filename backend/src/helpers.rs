use super::models::{AppKeyExchangePayload, ClientAuthObject, InitialClientAuth, User};
use crate::models::{self, AppKey, SentMessage, StoredMessage, StoredTempKey, CredentialResponse};
use argon2::{Argon2, PasswordHash, PasswordVerifier};
use chrono::Utc;
use diesel::mysql::MysqlConnection;
use diesel::prelude::*;
use dotenvy::dotenv;
use std::env;

pub fn verify_standard(
    auth_obj: InitialClientAuth,
    possible_app_key: Option<String>,
) -> Result<User, diesel::result::Error> {
    use crate::schema::users::dsl::*;
    let mut connection = establish_db();

    let matching_obj: Result<User, diesel::result::Error> = users
        .filter(email.eq(auth_obj.email))
        .first::<User>(&mut connection);

    match matching_obj {
        Ok(resulting_user_object) => {
            let password_hash: Result<PasswordHash, _> =
                PasswordHash::new(&resulting_user_object.password);

            match password_hash {
                Ok(hashed_password_success) => {
                    let algs: &[&dyn PasswordVerifier] = &[&Argon2::default()];
                    if hashed_password_success
                        .verify_password(algs, auth_obj.password)
                        .is_ok()
                    {
                        return Ok(resulting_user_object);
                    } else {
                        use crate::schema::app_keys::dsl::*;
                        diesel::delete(app_keys)
                            .filter(app_key.eq(possible_app_key.unwrap()))
                            .execute(&mut connection)
                            .expect("Failed to delete key after failed auth, Keys COMPROMISED");
                        return Err(diesel::result::Error::NotFound);
                    }
                }
                Err(_) => {
                    return Err(diesel::result::Error::NotFound);
                }
            }
        }
        Err(_) => {
            use crate::schema::app_keys::dsl::*;
            diesel::delete(app_keys)
                .filter(app_key.eq(possible_app_key.unwrap()))
                .execute(&mut connection)
                .expect("Failed to delete key after failed auth, Keys COMPROMISED");
            return Err(diesel::result::Error::NotFound);
        }
    }
}

pub fn verify_auth(auth_obj: ClientAuthObject) -> Result<User, diesel::result::Error> {
    use crate::schema::app_keys::dsl::*;
    let mut connection = establish_db();

    let matching_app_key = app_keys
        .filter(app_key.eq(&auth_obj.app_key))
        .first::<AppKey>(&mut connection);
    // let hashed_app_key = auth_obj.app_key

    match matching_app_key {
        Ok(_) => {}
        Err(_) => {
            use crate::schema::users::dsl::*;
            diesel::delete(users)
                .execute(&mut connection)
                .expect("Failed to disable login, Keys COMPROMISED");
            return Err(diesel::result::Error::NotFound);
        }
    }

    verify_standard(
        InitialClientAuth {
            email: auth_obj.email,
            password: auth_obj.password,
        },
        Some(auth_obj.app_key),
    )
}

pub fn client_key_gen(
    auth_obj: InitialClientAuth,
    app_key: String,
) -> Result<CredentialResponse, diesel::result::Error> {
    use crate::schema::temp_keys::dsl::*;
    let mut connection = establish_db();
    let no_app_key: Option<String> = None;
    if let Ok(user_credentials) = verify_standard(auth_obj, no_app_key) {
        let matching_key: QueryResult<StoredTempKey> = temp_keys
            .filter(temp_key.eq(app_key))
            .first::<StoredTempKey>(&mut connection);

        if let Ok(genuine_temp_key) = matching_key {
            let is_deleted = diesel::delete(temp_keys)
                .filter(id.eq(genuine_temp_key.id))
                .execute(&mut connection);

            if let Ok(_) = is_deleted {
                use crate::schema::app_keys::dsl::*;
                let final_key: QueryResult<AppKey> = app_keys
                    .filter(id.eq(genuine_temp_key.key_id))
                    .first::<AppKey>(&mut connection);

                if let Ok(key) = final_key {
                    return Ok(
                        CredentialResponse {
                            app_key: key.app_key,
                            user_id: user_credentials.id.to_string(),
                        }
                    );
                }
            }
        }
    }

    return Err(diesel::result::Error::NotFound);
}

pub fn message_is_for_user(message: &String, user_id: &String, recipient_id: String) -> bool {
    let deserialisation_result: Result<StoredMessage, serde_json::Error> =
        serde_json::from_str(&message);
    match deserialisation_result {
        Ok(parsed_message) => {
            return (&parsed_message.recipient_id == user_id
                || &parsed_message.sender_id == user_id)
                && (&parsed_message.recipient_id == &recipient_id
                    || &parsed_message.sender_id == &recipient_id);
        }
        Err(_) => {
            return false;
        }
    }
}

pub fn fetch_message_vec(
    range: i8,
    auth_obj: User,
    parsed_sender_id: String,
) -> QueryResult<Vec<models::StoredMessage>> {
    use crate::schema::sent_messages::dsl::*;
    let mut connection = establish_db();

    let message_list: QueryResult<Vec<StoredMessage>> = sent_messages
        .filter(
            recipient_id
                .eq(auth_obj.id.to_string())
                .and(sender_id.eq(&parsed_sender_id))
                .or(recipient_id
                    .eq(&parsed_sender_id)
                    .and(sender_id.eq(auth_obj.id.to_string()))),
        )
        .limit(range.into())
        .load(&mut connection);

    message_list
}

pub fn message_processor(message_object: SentMessage, signed_in_user: &User) -> StoredMessage {
    use crate::schema::sent_messages::dsl::*;
    let mut connection = establish_db();

    let new_message = StoredMessage {
        id: uuid::Uuid::new_v4().as_hyphenated().to_string(),
        message_body: message_object.message_body,
        sender_id: signed_in_user.id.to_string(),
        recipient_id: message_object.recipient_id,
        time: Utc::now().naive_utc(),
        message_key_range: message_object.message_key_range,
    };

    let _ = diesel::insert_into(sent_messages)
        .values(&new_message)
        .execute(&mut connection)
        .expect("Message NOT saved");
    new_message
}

pub fn establish_db() -> MysqlConnection {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL env is NOT set");

    MysqlConnection::establish(&database_url)
        .unwrap_or_else(|_| panic!("Error Connecting to {}", database_url))
}
