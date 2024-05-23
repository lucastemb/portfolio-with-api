import {useState, useEffect} from "react";
import axios  from "axios";
import Project from '../project'
import Experience from '../experience'
import Upload from "./uploadnew";

const Dashboard = () => {

    const [projects, setProjects] = useState<Project[]>([]);
    const [experience, setExperience] = useState<Experience[]>([]); 

    const [workXpImage, setWorkXpImage] = useState<string>("");
    
    const [newExperience, setNewExperience] = useState({
        company: '',
        dates: '',
        logo: '',
        resp: [''],
      });  


    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
        setNewExperience({ ...newExperience, [field]: event.target.value });
    };

    const addResp = () => {
        setNewExperience(prev => ({...prev, resp: [...prev.resp, '']}))
    }

    const deleteResp = (index: number) => {
        setNewExperience(prev=> ({...prev, resp:[
            ...prev.resp.filter((_, i)=> i !== index)
        ]}))
    }

    const handleRespChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const newResp = [...newExperience.resp];
        newResp[index] = event.target.value;
        setNewExperience(prev => ({ ...prev, resp: newResp }));
    };

    const [category, setCategory] = useState<number>(3); 
    const handleClick = (number: number) => () => {
        setCategory(number);
    };

    const sendWorkExperience = (workexp: Experience) => {
        axios.post("http://localhost:8080/work-experience", workexp).then((response)=>{
            console.log("Data posted successfully!", response.data);
        }).catch((error)=> {
            console.error("There was an error sending the data", error);
        })
    }

    useEffect(()=>{
        console.log(newExperience);
    }, [newExperience]);


    useEffect(()=>{
        if(category === 0){
        axios.get("http://localhost:8080/get-workexp").then((res)=>{
            setExperience(res.data);
            console.log(res.data);
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
        
        {category === 0 ? <div className="border-2 p-3 m-3 rounded-md">
        <form>
          <div className="mb-2">
            <label className="block" htmlFor="company">Company</label>
            <input
              id="company"
              type="text"
              value={experience.company}
              onChange={(e) => handleInputChange(e, 'company')}
              className="border rounded-md p-2 w-full"
            />
          </div>

          <div className="mb-2">
            <label className="block" htmlFor="dates">Dates</label>
            <input
              id="dates"
              type="text"
              value={experience.dates}
              onChange={(e) => handleInputChange(e, 'dates')}
              className="border rounded-md p-2 w-full"
            />
          </div>

          <div className="mb-2">
            <label className="block" htmlFor="logo">Logo</label>
           <Upload setImage={setWorkXpImage} setNewObject={setNewExperience}/>
          </div>

          <div className="mb-2">
            <label className="block" htmlFor="resp">
            Responsibilities:
            {newExperience.resp.map((responsibility, index) => (
                <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={responsibility}
                  onChange={(event) => handleRespChange(index, event)}
                  className="p-2 border flex-grow"
                />
                <button type="button" onClick={()=> deleteResp(index)}>
                    Delete
                </button>
                </div>
                
            ))}
            <div>
            <button  type="button" onClick={()=> addResp()}>
                Add
            </button>
            </div>
            </label>
            
          </div>
        </form>
        <button type="button" onClick={()=> sendWorkExperience(newExperience)}>
            Submit
        </button>
      </div> : <div></div>}
        </>
    );
}

export default Dashboard;