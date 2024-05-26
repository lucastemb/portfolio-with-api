interface Project {
    languages: string[];
    desc: string;
    resp: string[];
    creation: string; 
    thumbnail: string;
    title: string;
    link: string; 
  }
  

  interface ProjectProps {
    projects: Project[];
  }
const Project = ({projects}: ProjectProps) => {
  return(
   <>  
   {projects ? ((projects.length > 0) ? (projects.map((project : Project, index : number)=> (
        <div className="border-2 p-3 m-3 rounded-md" key = {index}> 
          <p className="font-semibold text-xl"> {project.title} </p> 
          <img src={project.thumbnail}/>
          <p> {project.creation} </p>
          <p> {project.desc} </p>
          <p> {project.resp.join(', ')} </p>
          <p> {project.languages.join(', ')} </p>
          <p> {project.link} </p>
        </div>
      ))) : "") : "Loading..."} 
    </>
  );
}

export default Project;