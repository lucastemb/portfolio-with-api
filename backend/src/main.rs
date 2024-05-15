
//import actix_web to make an API
use std::error::Error;
use actix_web::{web, App, HttpServer, HttpResponse, Responder};


//project schema 
#[derive(serde::Deserialize)]
struct Project {
    languages: Vec<String>,
    desc: String,
    resp: Vec<String>,
    creation: String,
    thumbnail: String,
    title: String,
    link: String,
    project_number: String
}

//post request at /projects end point (add project to db)
#[actix_web::post("/projects")]
async fn create(project: web::Json<Project>, pool: web::Data<sqlx::PgPool>) -> Result<HttpResponse, Box<dyn Error>> {
    let query = "INSERT INTO project (languages, descript, responsibilities, date_created, thumbnail, title, link, project_number) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)";
    //build a query the project into the project table
    sqlx::query(query)
        .bind(&project.languages)
        .bind(&project.desc)
        .bind(&project.resp)
        .bind(&project.creation)
        .bind(&project.thumbnail)
        .bind(&project.title)
        .bind(&project.link)
        .bind(&project.project_number)
        .execute(pool.get_ref())
        .await?;

    Ok(HttpResponse::Ok().body("Project created successfully"))
}

//main function 
#[actix_web::main]
async fn main() -> Result<(), Box<dyn Error>> {

    std::env::set_var("RUST_LOG", "debug");
    env_logger::init();

    let url = "postgres://postgres:postgres@localhost:5432/postgres";
    let pool = sqlx::postgres::PgPool::connect(url).await?;

    sqlx::migrate!("./migrations").run(&pool).await?;

    let port = 8080; 
    println!("Starting server on port {}", port);

    HttpServer::new(move || App::new().app_data(web::Data::new(pool.clone())).service(greet).service(create))
        .bind(("127.0.0.1", port))?
        .workers(2)
        .run()
        .await?;

    Ok(())
}
