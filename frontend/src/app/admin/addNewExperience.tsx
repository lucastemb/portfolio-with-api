import {useState, useEffect, useRef, SetStateAction, Dispatch} from "react";
import axios  from "axios";
import WorkExp from '../experience'
import Upload from "./uploadnew";

const NewExperience  = () => {
    const [workXpImage, setWorkXpImage] = useState<string>("");
    const [newExperience, setNewExperience] = useState<WorkExp>({
        company: '',
        dates: '',
        logo: '',
        resp: [],
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

    const sendWorkExperience = (workexp: WorkExp) => {
        axios.post("http://localhost:8080/work-experience", workexp).then((response)=>{
            console.log("Data posted successfully!", response.data);
        }).catch((error)=> {
            console.error("There was an error sending the data", error);
        })
    }

     //workExperienceImages (logos) can only be changed upon submission; thus, when workXpImages change send an image.
     useEffect(()=>{
        //should only take effect if workXpImage is not blank if not it will add a new submission every time the page is refreshed
        if(workXpImage !== ""){
            sendWorkExperience(newExperience);
        }
    }, [workXpImage])
    
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
          <label className="block" htmlFor="company">Company</label>
          <input
            id="company"
            type="text"
            value={newExperience.company}
            onChange={(e) => handleInputChange(e, 'company')}
            className="border rounded-md p-2 w-full"
          />
        </div>

        <div className="mb-2">
          <label className="block" htmlFor="dates">Dates</label>
          <input
            id="dates"
            type="text"
            value={newExperience.dates}
            onChange={(e) => handleInputChange(e, 'dates')}
            className="border rounded-md p-2 w-full"
          />
        </div>

        <div className="mb-2">
          <label className="block" htmlFor="logo">Logo</label>
         <Upload ref={uploadRef} type={0} setImage={setWorkXpImage} setNewObject={setNewExperience}/>
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
      <button type="button" onClick={handleSubmit}>
          Submit
      </button>
      </>
    );
}

export default NewExperience;