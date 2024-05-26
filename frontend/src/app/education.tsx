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
        <div  className="border-2 p-3 m-3 rounded-md" key = {index}> 
          <p className="font-semibold text-xl"> {education.school} </p> 
          <img src={education.logo}/>
          <p> {education.years} </p>
          <p> {education.ecs.join(', ')} </p>
          <p> {education.awards.join(', ')} </p>
        </div>
      ))) : "") : "Loading..."} 
    </>
  );
}

export default Education;