create table education (
    logo varchar not null, 
    school varchar primary key not null, 
    awards text[],
    ecs text[],
    years varchar not null
);