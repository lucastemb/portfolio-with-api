use std::error::Error;
use sqlx::Connection;
use sqlx::Row;

struct Project {
    language: Vec<String>,
    desc: String,
    resp: Vec<String>,
    creation: String,
    thumbnail: String,
    title: String,
    link: String,
}

//DATABASE

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let url = "postgres://postgres:postgres@localhost:5432/postgres";

    let mut conn = sqlx::postgres::PgConnection::connect(url).await?; 

    let res = sqlx::query("SELECT 1 + 1 as sum").fetch_one(&mut conn).await?;

    let sum: i32 = res.get("sum");

    println!("1 + 1 = {}", sum);

    Ok(())
}