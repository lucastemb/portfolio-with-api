import {useState, useEffect, useRef, SetStateAction, Dispatch} from "react";
import axios, { AxiosResponse }  from "axios";
import Education from '../education'
import Upload from "./uploadnew";

interface NewEducationProps {
    editEducation?: Education;
    edit: boolean; 
}

const NewEducation = ({edit, editEducation}: NewEducationProps) => {
    const [eduImage, setEduImage] = useState<string>("");
    const [changeImage, setChangeImage] = useState<boolean>(false);
    const [newEducation, setNewEducation] = useState<Education>({
        logo: editEducation?.logo || "",
        school: editEducation?.school || "",
        awards: editEducation?.awards || [], 
        years: editEducation?.years || "",
        ecs: editEducation?.ecs || [],
      });  
    
    const editImage = ():void => {
        setChangeImage(!changeImage);
    }
    const handleEdit = (newEducation: Education): void => {
        axios.patch(`http://localhost:8080/update-education/${encodeURI(newEducation.school)}`, newEducation).then((response: AxiosResponse)=> {
            console.log("Entry edited successfully", response)
        }).catch((error: Error)=> {
            console.error("Error editing entry!", error);
        })
    }

    const deleteEntry = (): void => {
        axios.delete(`http://localhost:8080/delete-education/${encodeURI(newEducation.school)}`).then((response)=> {
            console.log("Entry deleted succesfully", response);
        }).catch((error: Error)=>{
            console.error("Error deleting entry.", error);
        })
    }

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
            if(!edit) {
                sendEducation(newEducation);
            }
            else {
                handleEdit(newEducation);
            }
        }
    }, [eduImage])

    useEffect(() => {
        console.log(newEducation);
    }, [newEducation]);
    
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
        else{
            handleEdit(newEducation);
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
            readOnly={edit}
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
          {edit ? 
          
          (!changeImage ? (<> <img src={editEducation?.logo}/> <button onClick={editImage}> Change Image </button> </>) 
          : <><Upload ref={uploadRef} setImage={setEduImage} setNewObject={setNewEducation}/>  <button onClick={editImage}> Cancel (x) </button></>)
          : <Upload ref={uploadRef} setImage={setEduImage} setNewObject={setNewEducation}/>}
         
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
      <div className="flex flex-col"> 
      <button type="button" onClick={handleSubmit}>
          Submit
      </button>
      {edit ? (
        <button type="button" onClick={deleteEntry}> 
            Delete (x)
        </button>
      ) : 
      <div></div> }
      </div> 
      </>
    );
}

export default NewEducation;