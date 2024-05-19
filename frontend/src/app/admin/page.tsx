"use client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import {useState} from "react";


export default function Admin(){
    const [loggedIn, setLoggedIn] = useState(false);
    return (
        <>
        <main>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_CLIENT_ID}>
        {!loggedIn && (<GoogleLogin
            onSuccess={(credentialResponse) => {
                const credentialResponseDecoded = jwtDecode(
                    credentialResponse.credential
                )
                setLoggedIn(true);
                console.log(credentialResponseDecoded)
            }}
            onError={() => {
                console.log('Login Failed');
            }}
        />)}

        {loggedIn && <p> Logged In! </p>}
        </GoogleOAuthProvider>
        </main>
        </>
    )
}