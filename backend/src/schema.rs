// @generated automatically by Diesel CLI.

diesel::table! {
    app_keys (id) {
        id -> Integer,
        #[max_length = 255]
        app_key -> Varchar,
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
    users,
);
