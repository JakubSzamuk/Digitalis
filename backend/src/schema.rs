// @generated automatically by Diesel CLI.

diesel::table! {
    app_keys (id) {
        id -> Integer,
        #[max_length = 255]
        app_key -> Varchar,
    }
}

diesel::table! {
    sent_messages (id) {
        #[max_length = 255]
        id -> Varchar,
        message_body -> Mediumtext,
        #[max_length = 255]
        sender_id -> Varchar,
        #[max_length = 255]
        recipient_id -> Varchar,
        time -> Datetime,
    }
}

diesel::table! {
    temp_keys (id) {
        id -> Integer,
        key_id -> Integer,
        #[max_length = 255]
        temp_key -> Varchar,
    }
}

diesel::table! {
    users (id) {
        id -> Integer,
        #[max_length = 255]
        email -> Varchar,
        #[max_length = 255]
        password -> Varchar,
    }
}

diesel::allow_tables_to_appear_in_same_query!(
    app_keys,
    sent_messages,
    temp_keys,
    users,
);
