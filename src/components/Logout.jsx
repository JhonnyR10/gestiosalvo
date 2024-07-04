// src/components/Logout.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";

const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return <span onClick={handleLogout}>Logout</span>;
};

export default Logout;
