"use client";

import { useState, useEffect } from "react"; 
import axios from 'axios';

interface Project {
  languages: string[];
  desc: string;
  resp: string[];
  creation: string; 
  thumbnail: string;
  title: string;
  link: string; 
}

interface WorkExp {
  company: string;
  resp: string[];
  dates: string;
  logo: string;
}

interface Education {
  logo: string;
  school: string;
  awards: string[];
  years: string;
  ecs: string[];
}



export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [experience, setExperience] = useState<WorkExp[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  
  useEffect(()=> {
    //get projects
    axios.get('http://localhost:8080/get-projects')
      .then(response => {
        setProjects(response.data);
      })
      .catch(error=> console.error("There was an error fetching the data.", error))

    //get work experience
    axios.get("http://localhost:8080/get-workexp").then(response=> {
      setExperience(response.data);
    })
    .catch(error=>console.error("There was an error fetching the data.", error))
    
    //get education
    axios.get("http://localhost:8080/get-education").then(response=> {
      setEducation(response.data)
    })
    .catch(error=>console.error("There was an error fetching the data.", error))
  },[]);


  useEffect(()=>{
    console.log(experience);
  }, [experience])

  return (
    <>
    <p> {projects ? 
    (
      (projects.length > 0) ? 
      (projects.map((project, index)=> (
      <div key ={index}>
        <p> {project.languages.join(', ')} </p> 
        <p> {project.desc} </p> 
        <p> {project.resp.join(', ')} </p>
        <p> {project.creation} </p> 
        <p> {project.thumbnail} </p> 
        <p> {project.title} </p> 
        <p> {project.link} </p> 
      </div>
      ))) 
      : "No entries found"
    ) : "Loading..."}</p>

    <p>
    {experience ? ((experience.length > 0) ? (experience.map((experience, index)=> (
      <div key = {index}> 
        <p> {(index+1)}. </p> 
        <p> {experience.logo} </p>
        <p> {experience.company} </p> 
        <p> {experience.dates} </p>
        <p> {experience.resp.join(', ')} </p>
      </div>
    ))) : "No entries found") : "Loading..."} 
    </p>

    <p>
    {education ? ((education.length > 0) ? (education.map((education, index)=> (
      <div key = {index}> 
      <p> {education.logo} </p>
      <p> {education.school} </p>
      <p> {education.awards} </p>
      <p> {education.years} </p>
      <p> {education.ecs} </p>
      </div>
    ))) : "No entries found") : "Loading..."} 
    </p>


    </>
  );
}
