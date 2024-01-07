# Use rust base
FROM rust

WORKDIR usr/src/
ADD . .

# Build the program for release and install diesel_cli
RUN cargo build --release
RUN cargo install diesel_cli --no-default-features --features mysql

# Run the entry point script
EXPOSE 5000
CMD ./target/release/backend
