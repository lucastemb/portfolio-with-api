#build stage

FROM rust:buster as builder 

WORKDIR /app

COPY . .

RUN cargo build --release

#production stage
FROM debian:buster-slim

WORKDIR /usr/local/bin

COPY --from=builder /app/target/release/backend .

CMD ["./backend"]