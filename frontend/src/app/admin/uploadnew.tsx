import {useState} from 'react';
import ReactS3Client from 'react-aws-s3-typescript';
import { s3Config } from './s3Config';
const Upload = () =>{

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string>("");
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files){
            setSelectedFile(event.target.files[0]);
            setFileName(event.target.files[0].name);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if(!selectedFile){
            alert('Please select a file first!');
            return;
        }
        const formData = new FormData();
        formData.append('photo', selectedFile);
        console.log(s3Config);
        const s3 = new ReactS3Client(s3Config);

        try{
            const res = await s3.uploadFile(selectedFile,fileName);
            console.log(res);
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
    return (
        <>
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="fileInput"> Upload Photo: </label>
                <input type="file" id="fileInput" onChange={handleFileChange}/>
            </div>
            {fileName && <p>Selected file: {fileName}</p>}
            <button type="submit"> Upload </button>
        </form>
        </>
    );
}

export default Upload;