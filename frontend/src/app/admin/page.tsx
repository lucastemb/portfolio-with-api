"use client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import {useEffect, useState} from "react";
import Upload from "./uploadnew";
import Dashboard from "./dashboard";


export default function Admin(){
    
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [failed, setFailed] = useState<boolean>(false);


    useEffect(()=>{
        console.log(failed);
    }, [])

    return (
        <>
        <main>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_CLIENT_ID || ""}>
        {!loggedIn && (<GoogleLogin
            onSuccess={(credentialResponse) => {
                const credentialResponseDecoded = jwtDecode(
                    credentialResponse.credential || ""
                ) as {email : string}
                if (credentialResponseDecoded.email === process.env.NEXT_PUBLIC_EMAIL){
                    setLoggedIn(true);
                }
                else{
                    setLoggedIn(true);
                    setFailed(true);
                }
            }}
            onError={() => {
                console.log('Login Failed');
            }}
        />)}

        {loggedIn && ((!failed) ? (
            <>
            <Dashboard/>
            </>
        ) :
        (<p> ERROR: Not an authorized user. </p>))}
        </GoogleOAuthProvider>
        </main>
        </>
    )
}