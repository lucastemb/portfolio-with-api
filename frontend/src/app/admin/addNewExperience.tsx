import {useState, useEffect, useRef, SetStateAction, Dispatch} from "react";
import axios, {AxiosResponse} from "axios";
import WorkExp from '../experience'
import Upload from "./uploadnew";

interface NewExperienceProps {
    editExperience?: WorkExp;
    edit: boolean; 
}

const NewExperience  = ({edit, editExperience}: NewExperienceProps) => {
    const [workXpImage, setWorkXpImage] = useState<string>("");
    const [changeImage, setChangeImage] = useState<boolean>(false);
    const [newExperience, setNewExperience] = useState<WorkExp>({
        company: editExperience?.company || '',
        dates: editExperience?.dates ||'',
        logo: editExperience?.logo || '',
        resp: editExperience?.resp || [],
      });  

    
    const editImage = ():void => {
        setChangeImage(!changeImage);
    }

    const handleEdit = (newExperience: WorkExp): void => {
        axios.patch(`http://localhost:8080/update-workexp/${encodeURI(newExperience.company)}`, newExperience).then((response: AxiosResponse)=> {
            console.log("Entry edited successfully", response)
        }).catch((error: Error)=> {
            console.error("Error editing entry!", error);
        })
    }

    const deleteEntry = (): void => {
        axios.delete(`http://localhost:8080/delete-work-experience/${encodeURI(newExperience.company)}`).then((response)=> {
            console.log("Entry deleted succesfully", response);
        }).catch((error: Error)=>{
            console.error("Error deleting entry.", error);
        })
    }

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
            if(edit){
                handleEdit(newExperience);
            }
            else{
                sendWorkExperience(newExperience);
            }
            
        }
    }, [workXpImage])
    
    const uploadRef = useRef<any>(null);

    const handleSubmit = async () => {
        if((changeImage && edit) || !edit){
            if(uploadRef.current){
                try{
                    await uploadRef.current.triggerUploadSubmit();
                } catch(error) {
                    console.error("There was an error uploading the experience", error);
                }
            }
        }
        else {
            handleEdit(newExperience);
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
            readOnly={edit}
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
           {edit ? 
          
          (!changeImage ? (<> <img src={editExperience?.logo}/> <button onClick={editImage}> Change Image </button> </>) 
          : <><Upload ref={uploadRef} setImage={setWorkXpImage} setNewObject={setNewExperience}/>  <button onClick={editImage}> Cancel (x) </button></>)
          : <Upload ref={uploadRef} setImage={setWorkXpImage} setNewObject={setNewExperience}/>}
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
      {edit ? (
        <button type="button" onClick={deleteEntry}> 
            Delete (x)
        </button>
      ) : 
      <div></div> }
      <button type="button" onClick={handleSubmit}>
          Submit
      </button>
      </>
    );
}

export default NewExperience;