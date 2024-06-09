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
        <div className="flex flex-row justify-around border-2 p-3 m-3 rounded-md" key = {index}> 
        <div className="w-1/2 flex-1 "> 
          <img src={project.thumbnail}/>
        </div> 
        <div className="flex flex-1 flex-col items-center justify-center"> 
          <p className="font-semibold text-xl"> {project.title} </p> 
          <p> {project.creation} </p>
          <p> {project.desc} </p>
          <p> {project.resp.join(', ')} </p>
          {project.languages && project.languages.map((l, key)=>(
            <i key={key} className={`ci ci-${l} ci-2x`}> </i>
          ))}
          <a className="text-sky-400" href={project.link}> {project.link} </a>
          </div> 
        </div>
      ))) : "") : "Loading..."} 
    </>
  );
}

export default Project;