
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
        <div className="flex flex-row justify-around border-2 p-3 m-3 rounded-md" key = {index}> 
          <div className="flex w-1/2 items-center">
          <img className="w-1/2" src={experience.logo}/>
          </div>
          <div className="flex-col flex justify-center items-center"> 
          <p className="font-semibold text-xl"> {experience.company} </p> 
          <p> {experience.dates} </p>
          <p> {experience.resp.join(', ')} </p>
          </div>
        </div>
      ))) : "") : "Loading..."} 
    </>
  );
}

export default WorkExp;