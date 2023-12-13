# Use rust base
FROM rust

ADD . .

# Build the program for release and install diesel_cli
WORKDIR usr/src/
# RUN cargo build --release
RUN cargo install diesel_cli --no-default-features --features mysql

# Run the entry point script
EXPOSE 5000
ENTRYPOINT ./entry.sh
