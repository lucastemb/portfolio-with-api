interface WorkExp {
    company: string;
    resp: string[];
    dates: string;
    logo: string;
  }

  interface ExperienceProps {
    experiences: WorkExp[];
  }
const ExperienceEdit = ({experiences}: ExperienceProps) => {
  return(
   <> 
   {experiences ? ((experiences.length > 0) ? (experiences.map((experience : WorkExp, index : number)=> (
        <div className="border-2 p-3 m-3 rounded-md" key = {index}> 
          <p className="font-semibold text-xl"> {experience.company} </p> 
          <p> {experience.dates} </p>
          <p> {experience.logo} </p>
          <p> {experience.resp.join(', ')} </p>
        </div>
      ))) : "") : "Loading..."} 
    </>
  );
}

export default ExperienceEdit;