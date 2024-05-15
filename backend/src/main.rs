use std::error::Error;
use sqlx::Row;

struct Project {
    languages: Vec<&'static str>,
    desc: String,
    resp: Vec<&'static str>,
    creation: String,
    thumbnail: String,
    title: String,
    link: String,
    project_number: String
}

//DATABASE
async fn create(project: &Project, pool: &sqlx::PgPool) -> Result<(), Box<dyn Error>> {
    let query = "INSERT INTO project (languages, descript, responsibilities, date_created, thumbnail, title, link, project_number) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)";

    sqlx::query(query)
        .bind(&project.languages)
        .bind(&project.desc)
        .bind(&project.resp)
        .bind(&project.creation)
        .bind(&project.thumbnail)
        .bind(&project.title)
        .bind(&project.link)
        .bind(&project.project_number)
        .execute(pool)
        .await?;
    
        Ok(())
}
#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let url = "postgres://postgres:postgres@localhost:5432/postgres";
    let pool = sqlx::postgres::PgPool::connect(url).await?;

    sqlx::migrate!("./migrations").run(&pool).await?;

    let project = Project {
        languages: vec!["Next.js", "Tailwind", "Firebase", "Express.js", "Node.js", "React"],
        desc: "This is just a little test".to_string(),
        resp: vec!["Worked on backend stuff"],
        creation: "Apr. 2024".to_string(),
        thumbnail: "NA".to_string(),
        title: "Culinary Compass".to_string(),
        link: "Link not available at this time".to_string(),
        project_number: "381232103821".to_string(),
    };

    create(&project, &pool).await?;

    Ok(())
}