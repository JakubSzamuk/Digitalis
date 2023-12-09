#!/bin/sh

echo "started"
# Setup database migrations
# diesel setup
# diesel migration generate user_tables
# diesel migration run

# Start the backend server
./target/release/backend

