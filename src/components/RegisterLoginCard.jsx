import { useState } from "react";
import LoginPage from "./LoginPage";
import Register from "./Register";
import logo from "../logoGestioSalvo2.png";

const RegisterLoginCard = () => {
  const [isLoginForm, setIsLoginForm] = useState(true);
  const toggleForm = () => {
    setIsLoginForm(!isLoginForm);
  };

  return (
    <div className=" d-flex flex-column align-items-center justify-content-center  mt-1">
      <img className="logo-login" src={logo} alt="logo"></img>
      <h1>GestioSalvo</h1>
      <div className={`card-container1 ${isLoginForm ? "" : "clicked"}`}>
        <div className="cardLR">
          <div className="card-inner">
            <div className={`card-face card-front`}>
              <LoginPage></LoginPage>
              <p className="mt-2">
                Non sei registrato?{" "}
                <span className="text-dark" onClick={toggleForm}>
                  <strong>Registrati!</strong>
                </span>
              </p>
            </div>
            <div className={`card-face card-back`}>
              <Register></Register>
              <p className="mt-2">
                Sei già registrato?{" "}
                <span onClick={toggleForm} className="text-dark">
                  <strong>Fai il login!</strong>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterLoginCard;
