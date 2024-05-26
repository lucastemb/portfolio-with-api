import {useState, Dispatch, SetStateAction, useImperativeHandle, forwardRef, ForwardedRef} from 'react';
import ReactS3Client from 'react-aws-s3-typescript';
import { s3Config } from './s3Config';
import WorkExp from '../experience';
import Education from "../education";
import Project from "../project";


interface UploadRef {
    triggerUploadSubmit: () => void;
}

interface UploadProps {
    setImage: Dispatch<SetStateAction<string>>;
    setNewObject: Dispatch<SetStateAction<WorkExp | Project | Education>>;
    type: number;
}

const Upload = forwardRef<UploadRef, UploadProps>((props, ref) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string>("");
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files){
            setSelectedFile(event.target.files[0]);
            setFileName(event.target.files[0].name);
        }
    };

    const handleSubmit = async () => {
        if(!selectedFile){
            alert('Please select a file first!');
            return;
        }
        const formData = new FormData();
        formData.append('photo', selectedFile);
        const s3 = new ReactS3Client(s3Config);

        try{
            const res = await s3.uploadFile(selectedFile,fileName.substring(0, fileName.lastIndexOf('.')));
            const link = res.location.slice(0, 56) + res.location.slice(57);
            props.setImage(link);
                props.setNewObject(
                    (prev: WorkExp | Project | Education)=>{
                        if('logo' in prev) {
                            return {...prev, logo: link};
                        }
                        else {
                            return {...prev, thumbnail: link}
                        }
                    }
                );
        }
        catch(error: any) {
            console.log('An error occurred:', error);

            if (error instanceof Response) {
              error.text().then((text: string) => {
                console.log('Error response body:', text);
              });
            }
        }

    }
    
    useImperativeHandle(ref, ()=> ({
        triggerUploadSubmit: handleSubmit,
    }));

    return (
        <>
            <div>
                <label htmlFor="fileInput"> Upload Photo: </label>
                <input type="file" id="fileInput" onChange={handleFileChange}/>
            </div>
            {fileName && <p>Selected file: {fileName}</p>}
        </>
    );
});

export default Upload;