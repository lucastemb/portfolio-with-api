"use client";

import { useState, useEffect } from "react"; 
import axios from 'axios';
import WorkExp from "./experience";
import Education from "./education";
import Project from "./project";



export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [experience, setExperience] = useState<WorkExp[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  
  useEffect(()=> {
    //get projects
    axios.get('http://localhost:8080/get-projects')
      .then(response => {
        console.log(response.data);
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
    <Education educations={education}/>
    <Project projects={projects}/>
    <WorkExp experiences={experience}/>
    


    </>
  );
}
