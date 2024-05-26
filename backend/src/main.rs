
//import actix_web to make an API
use std::error::Error;
use actix_web::http::header;
use actix_web::{web, App, HttpServer, HttpResponse};
use sqlx::Row;
use actix_cors::Cors;


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

//delete project with given title
#[actix_web::delete("/delete-project/{title}")]
async fn delete_project(title: web::Path<String>, pool: web::Data<sqlx::PgPool>) -> Result<HttpResponse, Box<dyn Error>> {
    let title = title.into_inner();
    let result = sqlx::query("DELETE FROM project WHERE title=$1")
        .bind(&title)
        .execute(pool.get_ref())
        .await;

    match result {
        Ok(_) => Ok(HttpResponse::Ok().body("Project deleted successfully")),
        Err(e) => Err(e.into())
    }

}

//delete workexp with given title
#[actix_web::delete("/delete-work-experience/{title}")]
async fn delete_work(title: web::Path<String>, pool: web::Data<sqlx::PgPool>) -> Result<HttpResponse, Box<dyn Error>> {
    let title = title.into_inner();
    let result = sqlx::query("DELETE FROM workexp WHERE company=$1")
        .bind(&title)
        .execute(pool.get_ref())
        .await;

    match result {
        Ok(_) => Ok(HttpResponse::Ok().body("Work experience deleted successfully")),
        Err(e) => Err(e.into())
    }

}

//delete education with given title
#[actix_web::delete("/delete-education/{title}")]
async fn delete_education(title: web::Path<String>, pool: web::Data<sqlx::PgPool>) -> Result<HttpResponse, Box<dyn Error>> {
    let title = title.into_inner();
    let result = sqlx::query("DELETE FROM education WHERE school=$1")
        .bind(&title)
        .execute(pool.get_ref())
        .await;

    match result {
        Ok(_) => Ok(HttpResponse::Ok().body("Education deleted successfully")),
        Err(e) => Err(e.into())
    }

}

//update project
#[actix_web::patch("/update-projects/{title}")]
async fn update_project(title: web::Path<String>, project: web::Json<Project>, pool: web::Data<sqlx::PgPool>) -> Result<HttpResponse, Box<dyn Error>>{
    let title = title.into_inner();
    let updated_project = project.into_inner();

    let result = sqlx::query("UPDATE project SET languages = $1, descript = $2, responsibilities = $3, date_created = $4, thumbnail = $5, link = $6,  WHERE title = $7")
    .bind(&updated_project.languages)
    .bind(&updated_project.desc)
    .bind(&updated_project.resp)
    .bind(&updated_project.creation)
    .bind(&updated_project.thumbnail)
    .bind(&updated_project.link)
    .bind(&title)
    .execute(pool.get_ref())
    .await;

    match result {
        Ok(_) => Ok(HttpResponse::Ok().body("Project updated successfully")),
        Err(e) => Err(e.into())
    }
}

//update education
#[actix_web::patch("/update-education/{school}")]
async fn update_education(school: web::Path<String>, education: web::Json<Education>, pool: web::Data<sqlx::PgPool>) -> Result<HttpResponse, Box<dyn Error>>{
    let school_name = school.into_inner();
    let updated_education = education.into_inner();

    let result = sqlx::query("UPDATE education SET logo = $1, awards = $2, ecs = $3, years = $4 WHERE school = $5")
    .bind(&updated_education.logo)
    .bind(&updated_education.awards)
    .bind(&updated_education.ecs)
    .bind(&updated_education.years)
    .bind(&school_name)
    .execute(pool.get_ref())
    .await;

    match result {
        Ok(_) => Ok(HttpResponse::Ok().body("Education updated successfully")),
        Err(e) => Err(e.into())
    }
}

//update work-experience
#[actix_web::patch("/update-workexp/{company}")]
async fn update_workexp(company: web::Path<String>, workxp: web::Json<WorkExp>, pool: web::Data<sqlx::PgPool>) -> Result<HttpResponse, Box<dyn Error>>{
    let company_name = company.into_inner();
    let updated_workexp = workxp.into_inner();
    let result = sqlx::query("UPDATE workexp SET logo = $1, descript = $2, dates = $3 WHERE company = $4")
    .bind(&updated_workexp.logo)
    .bind(&updated_workexp.resp)
    .bind(&updated_workexp.dates)
    .bind(&company_name)
    .execute(pool.get_ref())
    .await;

    match result {
        Ok(_) => Ok(HttpResponse::Ok().body("Work experience updated successfully")),
        Err(e) => Err(e.into())
    }
}
//main function 
#[actix_web::main]
async fn main() -> Result<(), Box<dyn Error>> {

    std::env::set_var("RUST_LOG", "info,debug");
    env_logger::init();

    let url = "postgres://postgres:postgres@db:5432/postgres";
    let pool = sqlx::postgres::PgPool::connect(url).await?;

    sqlx::migrate!("./migrations").run(&pool).await?;

    let port = 8080; 
    println!("Starting server on port {}", port);

    HttpServer::new(move || {let cors = Cors::default().allowed_origin("http://localhost:3000").allowed_methods(vec!["GET", "POST", "DELETE", "PATCH"]).allowed_headers(vec![header::AUTHORIZATION, header::ACCEPT, header::CONTENT_TYPE]).supports_credentials().max_age(3600); App::new().wrap(cors).app_data(web::Data::new(pool.clone())).service(add_education).service(add_project).service(add_workxp).service(get_projects).service(get_education).service(get_workexp).service(delete_project).service(delete_work).service(delete_education).service(update_workexp).service(update_education).service(update_project)})
        .bind(("0.0.0.0", port))?
        .workers(2)
        .run()
        .await?;

    Ok(())
}
