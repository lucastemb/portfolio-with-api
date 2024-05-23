
import {useEffect} from "react";

interface WorkExp {
    company: string;
    resp: string[];
    dates: string;
    logo: string;
  }

  interface ExperienceProps {
    experiences: WorkExp[];
  }


const WorkExp = ({experiences}: ExperienceProps) => {

  return(
   <> 
   {experiences ? ((experiences.length > 0) ? (experiences.map((experience : WorkExp, index : number)=> (
        <div className="border-2 p-3 m-3 rounded-md" key = {index}> 
          <p className="font-semibold text-xl"> {experience.company} </p> 
          <p> {experience.dates} </p>
          <img src={experience.logo}/>
          <p> {experience.resp.join(', ')} </p>
        </div>
      ))) : "") : "Loading..."} 
    </>
  );
}

export default WorkExp;