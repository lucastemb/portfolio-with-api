
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
}

#[derive(serde::Deserialize)]
struct WorkExp {
    company: String,
    resp: Vec<String>,
    dates: String,
    logo: String
    
}

#[derive(serde::Deserialize)]
struct Education {
    logo: String,
    school: String,
    awards: Vec<String>, 
    years: String,
    ecs: Vec<String>
}


//post request at /projects end point (add project to db)
#[actix_web::post("/projects")]
async fn add_project(project: web::Json<Project>, pool: web::Data<sqlx::PgPool>) -> Result<HttpResponse, Box<dyn Error>> {
    let query = "INSERT INTO project (languages, descript, responsibilities, date_created, thumbnail, title, link) VALUES ($1, $2, $3, $4, $5, $6, $7)";
    //build a query the project into the project table
    sqlx::query(query)
        .bind(&project.languages)
        .bind(&project.desc)
        .bind(&project.resp)
        .bind(&project.creation)
        .bind(&project.thumbnail)
        .bind(&project.title)
        .bind(&project.link)
        .execute(pool.get_ref())
        .await?;

    Ok(HttpResponse::Ok().body("Project added successfully"))
}

//POST request at /work-experience end point (add work-exp to db)
#[actix_web::post("/work-experience")]
async fn add_workxp(experience: web::Json<WorkExp>, pool: web::Data<sqlx::PgPool>) -> Result<HttpResponse, Box<dyn Error>> {
    let query = "INSERT INTO workexp (company, descript, dates, logo) VALUES ($1, $2, $3, $4)";
    //build a query the project into the project table
    sqlx::query(query)
        .bind(&experience.company)
        .bind(&experience.resp)
        .bind(&experience.dates)
        .bind(&experience.logo)
        .execute(pool.get_ref())
        .await?;

    Ok(HttpResponse::Ok().body("Work experience added successfully"))
}

//POST request at /education end point (add education to db)
#[actix_web::post("/education")]
async fn add_education(education: web::Json<Education>, pool: web::Data<sqlx::PgPool>) -> Result<HttpResponse, Box<dyn Error>> {
    let query = "INSERT INTO education (logo, school, awards, ecs, years) VALUES ($1, $2, $3, $4, $5)";
    //build a query the project into the project table
    sqlx::query(query)
        .bind(&education.logo)
        .bind(&education.school)
        .bind(&education.awards)
        .bind(&education.ecs)
        .bind(&education.years)
        .execute(pool.get_ref())
        .await?;

    Ok(HttpResponse::Ok().body("Education added successfully"))
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

    HttpServer::new(move || App::new().app_data(web::Data::new(pool.clone())).service(add_education).service(add_project).service(add_workxp))
        .bind(("127.0.0.1", port))?
        .workers(2)
        .run()
        .await?;

    Ok(())
}
