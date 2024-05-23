import {useState, useEffect, useRef} from "react";
import axios  from "axios";
import Project from '../project'
import Experience from '../experience'
import NewExperience from './addNewExperience';
const Dashboard = () => {

    const [projects, setProjects] = useState<Project[]>([]);
    const [experience, setExperience] = useState<Experience[]>([]); 
    const [category, setCategory] = useState<number>(3); 
    const handleClick = (number: number) => () => {
        setCategory(number);
    };

    useEffect(()=>{
        if(category === 0){
        axios.get("http://localhost:8080/get-workexp").then((res)=>{
            setExperience(res.data);
        })
        }
    },
    [category])

    return (
        <>
        <div className="flex flex-row justify-around"> 
        <p className={category === 0 ? "text-red-600" : "text-black"} onClick={handleClick(0)}> Work Experience </p>
        <p className={category === 1 ? "text-red-600" : "text-black"} onClick={handleClick(1)}> Education </p>
        <p className={category === 2 ? "text-red-600" : "text-black"} onClick={handleClick(2)}> Personal Projects </p>
        </div>
        
        {category === 0 ? <NewExperience/> : <div></div>}
        </>
    );
}

export default Dashboard;