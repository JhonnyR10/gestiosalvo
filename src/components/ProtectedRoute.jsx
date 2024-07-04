import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import EmailVerification from "./EmailVerification";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthenticated(true);
        setEmailVerified(user.emailVerified);
      } else {
        setAuthenticated(false);
        setEmailVerified(false);
        navigate("/");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (authenticated && !emailVerified) {
    return <EmailVerification />;
  }

  return authenticated && emailVerified ? children : null;
};

export default ProtectedRoute;
