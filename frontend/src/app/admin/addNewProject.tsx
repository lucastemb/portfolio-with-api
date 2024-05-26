import {useState, useEffect, useRef, SetStateAction, Dispatch} from "react";
import axios  from "axios";
import Project from '../project';
import Upload from "./uploadnew";

const NewProject  = () => {
    const [thumbnail, setThumbnail] = useState<string>("");
    const [newProject, setNewProject] = useState<Project>({
        languages: [],
        desc: '',
        resp: [],
        creation: '',
        thumbnail: '',
        title: '',
        link: '',
      });  



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
            console.log(newProject);
            sendProject(newProject);
        }
    }, [thumbnail])
    
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
          <label className="block" htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={newProject.title}
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
         <Upload ref={uploadRef} type={0} setImage={setThumbnail} setNewObject={setNewProject}/>
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
      </>
    );
}

export default NewProject;