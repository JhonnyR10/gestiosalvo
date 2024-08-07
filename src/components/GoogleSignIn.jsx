import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import {
  getAuth,
  signInWithCredential,
  GoogleAuthProvider,
} from "firebase/auth";
import { useNavigate } from "react-router";

const GoogleSignIn = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLoginSuccess = async (response) => {
    const { credential } = response;
    const googleCredential = GoogleAuthProvider.credential(credential);

    try {
      const userCredential = await signInWithCredential(auth, googleCredential);
      console.log("Utente loggato:", userCredential.user);
      navigate("/home");
    } catch (error) {
      console.error("Errore durante il login con Google:", error);
    }
  };

  const handleLoginError = (error) => {
    console.error("Login con Google fallito:", error);
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <GoogleLogin onSuccess={handleLoginSuccess} onError={handleLoginError} />
    </GoogleOAuthProvider>
  );
};

export default GoogleSignIn;
