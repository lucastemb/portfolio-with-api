create table project (
    languages text[] not null, 
    descript text not null,
    responsibilities text[] not null,
    date_created varchar, 
    thumbnail varchar, 
    title varchar primary key not null, 
    link text
);
