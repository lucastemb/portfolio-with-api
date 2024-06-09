import {useState, useEffect, useRef, SetStateAction, Dispatch} from "react";
import axios, {AxiosResponse} from "axios";
import Project from '../project';
import Upload from "./uploadnew";

interface NewProjectProps {
  editProject?: Project;
  edit: boolean;
}
const NewProject  = ({editProject, edit}: NewProjectProps) => {
    const [thumbnail, setThumbnail] = useState<string>("");
    const [changeImage, setChangeImage] = useState<boolean>(false);
    const [newProject, setNewProject] = useState<Project>({
        languages: editProject?.languages || [],
        desc: editProject?.desc || '',
        resp: editProject?.resp || [],
        creation: editProject?.creation || '',
        thumbnail: editProject?.thumbnail || '',
        title: editProject?.title || '',
        link: editProject?.link || '',
      });  

    const editImage = (): void => {
      setChangeImage(!changeImage);
    }
    useEffect(()=> {
      console.log(newProject);
    }, [newProject])
    const handleEdit = (newProject: Project): void => {
      axios.patch(`http://localhost:8080/update-projects/${encodeURI(newProject.title)}`, newProject).then((response: AxiosResponse)=> {
          console.log("Entry edited successfully", response)
      }).catch((error: Error)=> {
          console.error("Error editing entry!", error);
      })
  }

    const deleteEntry = (): void => {
        axios.delete(`http://localhost:8080/delete-project/${encodeURI(newProject.title)}`).then((response)=> {
            console.log("Entry deleted succesfully", response);
        }).catch((error: Error)=>{
            console.error("Error deleting entry.", error);
        })
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
        setNewProject({ ...newProject, [field]: event.target.value });
    };

    const addLanguage = () => {
        setNewProject(prev => ({...prev, languages: [...prev.languages, '']}))
    }

    const deleteLanguage = (index: number) => {
        setNewProject(prev=> ({...prev, languages:[
            ...prev.languages.filter((_, i)=> i !== index)
        ]}))
    }

    const handleLanguageChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const newResp = [...newProject.languages];
        newResp[index] = event.target.value;
        setNewProject(prev => ({ ...prev, languages: newResp }));
    };

    const addResp = () => {
        setNewProject(prev => ({...prev, resp: [...prev.resp, '']}))
    }

    const deleteResp = (index: number) => {
        setNewProject(prev=> ({...prev, resp:[
            ...prev.resp.filter((_, i)=> i !== index)
        ]}))
    }

    const handleRespChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const newResp = [...newProject.resp];
        newResp[index] = event.target.value;
        setNewProject(prev => ({ ...prev, resp: newResp }));
    };

    const sendProject = (project: Project) => {
        axios.post("http://localhost:8080/projects", project).then((response)=>{
            console.log("Data posted successfully!", response.data);
        }).catch((error)=> {
            console.error("There was an error sending the data", error);
        })
    }

     //EducationerienceImages (logos) can only be changed upon submission; thus, when workXpImages change send an image.
     useEffect(()=>{
        //should only take effect if workXpImage is not blank if not it will add a new submission every time the page is refreshed
        if(thumbnail !== ""){
            if(!edit){
              sendProject(newProject);
            }
            else{
              handleEdit(newProject);
            }
            
        }
    }, [thumbnail])
    
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
        handleEdit(newProject);
      }
    }

    return(
        <>
        <form>
        <div className="mb-2">
          <label className="block" htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={newProject.title}
            readOnly={edit}
            onChange={(e) => handleInputChange(e, 'title')}
            className="border rounded-md p-2 w-full"
          />
        </div>
        <div className="mb-2">
          <label className="block" htmlFor="desc">Description</label>
          <input
            id="desc"
            type="text"
            value={newProject.desc}
            onChange={(e) => handleInputChange(e, 'desc')}
            className="border rounded-md p-2 w-full"
          />
        </div>
        <div className="mb-2">
          <label className="block" htmlFor="link">Link</label>
          <input
            id="link"
            type="text"
            value={newProject.link}
            onChange={(e) => handleInputChange(e, 'link')}
            className="border rounded-md p-2 w-full"
          />
        </div>

        <div className="mb-2">
          <label className="block" htmlFor="creation">Date Created</label>
          <input
            id="creation"
            type="text"
            value={newProject.creation}
            onChange={(e) => handleInputChange(e, 'creation')}
            className="border rounded-md p-2 w-full"
          />
        </div>

        <div className="mb-2">
          <label className="block" htmlFor="thumbnail">Thumbnail</label>
          {edit ? 
          
          (!changeImage ? (<> <img src={editProject?.thumbnail}/> <button onClick={editImage}> Change Image </button> </>) 
          : <><Upload ref={uploadRef} setImage={setThumbnail} setNewObject={setNewProject}/>  <button onClick={editImage}> Cancel (x) </button></>)
          : <Upload ref={uploadRef} setImage={setThumbnail} setNewObject={setNewProject}/>}
        </div>

        <div className="mb-2">
          <label className="block" htmlFor="languages">
          Languages:
          {newProject.languages.map((language, index) => (
              <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                value={language}
                onChange={(event) => handleLanguageChange(index, event)}
                className="p-2 border flex-grow"
              />
              <button type="button" onClick={()=> deleteLanguage(index)}>
                  Delete
              </button>
              </div>
              
          ))}
          <div>
          <button  type="button" onClick={()=> addLanguage()}>
              Add
          </button>
          </div>
          </label>
          
        </div>

        <div className="mb-2">
          <label className="block" htmlFor="awards">
          Responsibilities:
          {newProject.resp.map((resp, index) => (
              <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                value={resp}
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
      {edit ? (
        <button type="button" onClick={deleteEntry}> 
            Delete (x)
        </button>
      ) : 
      <div></div> }
      </>
    );
}

export default NewProject;