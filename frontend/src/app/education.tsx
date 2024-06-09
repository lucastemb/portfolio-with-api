interface Education {
    logo: string;
    school: string;
    awards: string[];
    years: string;
    ecs: string[];
  }

  interface EducationProps {
    educations: Education[];
  }
const Education = ({educations}: EducationProps) => {
  return(
   <> 
   {educations ? ((educations.length > 0) ? (educations.map((education : Education, index : number)=> (
        <div  className="border-2 p-3 m-3 rounded-md flex flex-row justify-around" key = {index}> 
          <div className="w-1/2 flex justify-center items-center">
          <img className="w-1/2" src={education.logo}/>
          </div> 
          <div className="flex flex-col justify-center items-center">
          <p className="font-semibold text-xl"> {education.school} </p> 
          <p> {education.years} </p>
          <p> {education.ecs.join(', ')} </p>
          <p> {education.awards.join(', ')} </p>
          </div>
        </div>
      ))) : "") : "Loading..."} 
    </>
  );
}

export default Education;