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
