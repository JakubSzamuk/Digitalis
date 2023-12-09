use crate::models::AppKey;

use super::models::{InitialMessage, User};
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

    let matching_obj = users
        .filter(email.eq(auth_obj.email))
        .filter(password.eq(auth_obj.password))
        .first::<User>(&mut connection);

    match matching_obj {
        Ok(_) => {
            return true;
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

pub fn establish_db() -> MysqlConnection {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL env is NOT set");

    MysqlConnection::establish(&database_url)
        .unwrap_or_else(|_| panic!("Error Connecting to {}", database_url))
}

pub fn create_user() {
    use crate::schema::users::dsl::*;

    let mut connection = establish_db();

    let new_user = User {
        id: 34,
        email: String::from("Hello"),
        password: String::from("World"),
    };
    diesel::insert_into(users)
        .values(&new_user)
        .execute(&mut connection)
        .expect("Error creating user");
}
