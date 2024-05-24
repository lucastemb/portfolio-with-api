import {useState, useEffect, useRef, SetStateAction, Dispatch} from "react";
import axios  from "axios";
import Education from '../education'
import Upload from "./uploadnew";

const NewEducation  = () => {
    const [eduImage, setEduImage] = useState<string>("");
    const [newEducation, setNewEducation] = useState<Education>({
        logo: "",
        school: "",
        awards: [], 
        years: "",
        ecs: [],
      });  


    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
        setNewEducation({ ...newEducation, [field]: event.target.value });
    };

    const addAward = () => {
        setNewEducation(prev => ({...prev, awards: [...prev.awards, '']}))
        console.log(newEducation);
    }

    const deleteAward = (index: number) => {
        setNewEducation(prev=> ({...prev, awards:[
            ...prev.awards.filter((_, i)=> i !== index)
        ]}))
    }

    const handleAwardChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const newResp = [...newEducation.awards];
        newResp[index] = event.target.value;
        setNewEducation(prev => ({ ...prev, awards: newResp }));
    };

    const addEC = () => {
        setNewEducation(prev => ({...prev, ecs: [...prev.ecs, '']}));
        console.log(newEducation);
    }

    const deleteEC = (index: number) => {
        setNewEducation(prev=> ({...prev, ecs:[
            ...prev.ecs.filter((_, i)=> i !== index)
        ]}))
    }

    const handleECChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const newEcs = [...newEducation.ecs];
        newEcs[index] = event.target.value;
        setNewEducation(prev => ({ ...prev, ecs: newEcs }));
    };

    const sendEducation = (education: Education) => {
        axios.post("http://localhost:8080/education", education).then((response)=>{
            console.log("Data posted successfully!", response.data);
        }).catch((error)=> {
            console.error("There was an error sending the data", error);
        })
    }

     //EducationerienceImages (logos) can only be changed upon submission; thus, when workXpImages change send an image.
     useEffect(()=>{
        //should only take effect if workXpImage is not blank if not it will add a new submission every time the page is refreshed
        if(eduImage !== ""){
            sendEducation(newEducation);
        }
    }, [eduImage])

    useEffect(() => {
        console.log(newEducation);
    }, [newEducation]);
    
    const uploadRef = useRef<any>(null);

    const handleSubmit = async () => {
        if(uploadRef.current){
            try{
                await uploadRef.current.triggerUploadSubmit();
            } catch(error) {
                console.error("There was an error uploading the experience", error);
            }
        }
    }

    return(
        <>
        <form>
        <div className="mb-2">
          <label className="block" htmlFor="school">School</label>
          <input
            id="school"
            type="text"
            value={newEducation.school}
            onChange={(e) => handleInputChange(e, 'school')}
            className="border rounded-md p-2 w-full"
          />
        </div>

        <div className="mb-2">
          <label className="block" htmlFor="years">Years</label>
          <input
            id="years"
            type="text"
            value={newEducation.years}
            onChange={(e) => handleInputChange(e, 'years')}
            className="border rounded-md p-2 w-full"
          />
        </div>

        <div className="mb-2">
          <label className="block" htmlFor="logo">Logo</label>
         <Upload ref={uploadRef} type={0} setImage={setEduImage} setNewObject={setNewEducation}/>
        </div>

        <div className="mb-2">
          <label className="block" htmlFor="ecs">
          ECS:
          {newEducation.ecs.map((ec, index) => (
              <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                value={ec}
                onChange={(event) => handleECChange(index, event)}
                className="p-2 border flex-grow"
              />
              <button type="button" onClick={()=> deleteEC(index)}>
                  Delete
              </button>
              </div>
              
          ))}
          <div>
          <button  type="button" onClick={()=> addEC()}>
              Add
          </button>
          </div>
          </label>
          
        </div>

        <div className="mb-2">
          <label className="block" htmlFor="awards">
          Awards:
          {newEducation.awards.map((award, index) => (
              <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                value={award}
                onChange={(event) => handleAwardChange(index, event)}
                className="p-2 border flex-grow"
              />
              <button type="button" onClick={()=> deleteAward(index)}>
                  Delete
              </button>
              </div>
              
          ))}
          <div>
          <button  type="button" onClick={()=> addAward()}>
              Add
          </button>
          </div>
          </label>
          
        </div>
      </form>
      <button type="button" onClick={handleSubmit}>
          Submit
      </button>
      </>
    );
}

export default NewEducation;