# 1. This tells docker to use the Rust official image
FROM rust

# 2. Copy the files in the machine to the Docker image
ADD ./ ./

# Build the program for release
RUN cargo build

# Run the binary
CMD ["./target/release/backend"]