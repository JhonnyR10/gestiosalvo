import React, { createContext, useState, useEffect, useContext } from "react";
import { auth } from "./firebaseConfig";
import {
  // eslint-disable-next-line
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("AuthProvider: onAuthStateChanged triggered", user);
      setCurrentUser(user);
      setLoading(false);
    });

    return () => {
      console.log("AuthProvider: Cleanup");
      unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    await auth.signInWithEmailAndPassword(email, password);
  };

  const logout = async () => {
    await auth.signOut();
  };
  const signup = async (email, password, displayName, phone) => {
    try {
      // Crea l'utente con email e password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Aggiorna il profilo dell'utente con l'URL della foto
      await updateProfile(user, {
        displayName: displayName,
        phoneNumber: phone,
      });

      // Invia la verifica dell'email
      await sendEmailVerification(user);
    } catch (error) {
      console.error("Error signing up: ", error);
    }
  };

  const value = {
    currentUser,
    login,
    signup,
    logout,
  };

  console.log("AuthProvider: Rendering", { currentUser, loading });
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
