use crate::models::{AppKey, SentMessage};

use super::models::{InitialMessage, User};
use argon2::{Argon2, PasswordHash, PasswordVerifier};
use diesel::mysql::MysqlConnection;
use diesel::prelude::*;
use dotenvy::dotenv;
use std::env;

pub fn verify_auth(auth_obj: InitialMessage) -> bool {
    use crate::schema::app_keys::dsl::*;
    use crate::schema::users::dsl::*;
    let mut connection = establish_db();

    let matching_app_key = app_keys
        .filter(app_key.eq(&auth_obj.app_key))
        .first::<AppKey>(&mut connection);

    match matching_app_key {
        Ok(_) => {}
        Err(_) => {
            diesel::delete(users)
                .execute(&mut connection)
                .expect("Failed to disable login, Keys COMPROMISED");
            return false;
        }
    }

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
                        return true;
                    } else {
                        return false;
                    }
                }
                Err(_) => {
                    return false;
                }
            }
        }
        Err(_) => {
            diesel::delete(app_keys)
                .filter(app_key.eq(auth_obj.app_key))
                .execute(&mut connection)
                .expect("Failed to delete key after failed auth, Keys COMPROMISED");
            return false;
        }
    }
}

pub fn message_processor(message_object: SentMessage) {}

pub fn establish_db() -> MysqlConnection {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL env is NOT set");

    MysqlConnection::establish(&database_url)
        .unwrap_or_else(|_| panic!("Error Connecting to {}", database_url))
}
