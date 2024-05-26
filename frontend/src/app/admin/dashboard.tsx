import {useState, useEffect, useRef} from "react";
import axios  from "axios";
import Project from '../project'
import Experience from '../experience'
import Education from '../education'
import NewExperience from './addNewExperience';
import NewEducation from './addNewEducation';
import NewProject from './addNewProject';
const Dashboard = () => {
    const [education, setEducation] = useState<Education[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [experience, setExperience] = useState<Experience[]>([]); 
    const [category, setCategory] = useState<number>(3); 
    const handleClick = (number: number) => () => {
        setCategory(number);
    };

    useEffect(()=>{
        axios.get("http://localhost:8080/get-workexp").then((res)=>{
            setExperience(res.data);
        })
        axios.get("http://localhost:8080/get-education").then(response=> {
        setEducation(response.data)
        })
        .catch(error=>console.error("There was an error fetching the data.", error))
    },
    [category])

    return (
        <>
        <div className="flex flex-row justify-around"> 
        <p className={category === 0 ? "text-red-600" : "text-black"} onClick={handleClick(0)}> Work Experience </p>
        <p className={category === 1 ? "text-red-600" : "text-black"} onClick={handleClick(1)}> Education </p>
        <p className={category === 2 ? "text-red-600" : "text-black"} onClick={handleClick(2)}> Personal Projects </p>
        </div>
        
        {category === 0 ? <> 
        
        <NewExperience edit={false}/>  
        {(experience.map((e)=> (
            <NewExperience edit={true} editExperience={e}/>
        )))}
        </>: <div></div>}
        {category === 1 ? 
            <> 
            <NewEducation edit={false}/> 
            {(education.map((e)=> (
            <NewEducation edit={true} editEducation={e}/>
            )))} 
            </>: <div></div>}
        {category === 2 ? <NewProject/>: <div></div>}
        </>
    );
}

export default Dashboard;