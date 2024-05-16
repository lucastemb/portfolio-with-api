
//import actix_web to make an API
use std::error::Error;
use actix_web::{web, App, HttpServer, HttpResponse};
use sqlx::Row;


//project schema 
#[derive(serde::Deserialize, serde::Serialize)]
struct Project {
    languages: Vec<String>,
    desc: String,
    resp: Vec<String>,
    creation: String,
    thumbnail: String,
    title: String,
    link: String,
}

#[derive(serde::Deserialize, serde::Serialize)]
struct WorkExp {
    company: String,
    resp: Vec<String>,
    dates: String,
    logo: String
    
}

#[derive(serde::Deserialize, serde::Serialize)]
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

//GET request at /get-projects end point (get all projects from db)
#[actix_web::get("/get-projects")]
async fn get_projects(pool: web::Data<sqlx::PgPool>) -> Result<HttpResponse, Box<dyn Error>> {
    let q = "SELECT * FROM project";
    let query = sqlx::query(q);
    
    let rows = query.fetch_all(pool.get_ref()).await?;

    let projects = rows.iter().map(|row| {
        Project {
            languages: row.get("languages"),
            desc: row.get("descript"),
            resp: row.get("responsibilities"),
            creation: row.get("date_created"),
            thumbnail: row.get("thumbnail"),
            title: row.get("title"),
            link: row.get("link"),
        }
    }).collect::<Vec<_>>();

    Ok(HttpResponse::Ok().json(projects))
}

//GET request at /get-education end point (get all projects from db)
#[actix_web::get("/get-education")]
async fn get_education(pool: web::Data<sqlx::PgPool>) -> Result<HttpResponse, Box<dyn Error>> {
    let q = "SELECT * FROM education";
    let query = sqlx::query(q);
    
    let rows = query.fetch_all(pool.get_ref()).await?;

    let education = rows.iter().map(|row| {
        Education {
            logo: row.get("logo"),
            school: row.get("school"),
            awards: row.get("awards"), 
            years: row.get("years"),
            ecs: row.get("ecs")
        }
    }).collect::<Vec<_>>();

    Ok(HttpResponse::Ok().json(education))
}

//GET request at /get-projects end point (get all projects from db)
#[actix_web::get("/get-workexp")]
async fn get_workexp(pool: web::Data<sqlx::PgPool>) -> Result<HttpResponse, Box<dyn Error>> {
    let q = "SELECT * FROM workexp";
    let query = sqlx::query(q);
    
    let rows = query.fetch_all(pool.get_ref()).await?;

    let workexp = rows.iter().map(|row| {
        WorkExp {
            company: row.get("company"),
            resp: row.get("descript"),
            dates: row.get("dates"),
            logo: row.get("logo")
        }
    }).collect::<Vec<_>>();

    Ok(HttpResponse::Ok().json(workexp))
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

    HttpServer::new(move || App::new().app_data(web::Data::new(pool.clone())).service(add_education).service(add_project).service(add_workxp).service(get_projects).service(get_education).service(get_workexp))
        .bind(("127.0.0.1", port))?
        .workers(2)
        .run()
        .await?;

    Ok(())
}
