import React, { useState, useEffect } from "react";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import GoogleSignIn from "./GoogleSignIn";
import { Envelope, Eye, EyeSlash, Key } from "react-bootstrap-icons";
import ReactDOM from "react-dom";
import {
  fetchSignInMethodsForEmail,
  getAuth,
  sendPasswordResetEmail,
} from "firebase/auth";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showAlert, setShowAlert] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    const loadReCAPTCHA = () => {
      if (window.grecaptcha) {
        window.grecaptcha.ready(() => {});
      }
    };

    // Aggiungi lo script reCAPTCHA al documento
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.REACT_APP_RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.onload = loadReCAPTCHA;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/home");
    } catch (error) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      console.error("Error logging in: ", error);
    }
  };
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("Inserisci il tuo indirizzo email per reimpostare la password.");
      setTimeout(() => setError(false), 3000);
      return;
    }
    setLoading(true);
    setResetSuccess(false);
    setError("");
    try {
      if (!window.grecaptcha) {
        setError("reCAPTCHA non è pronto. Riprova più tardi.");
        setTimeout(() => setError(""), 3000);
        setLoading(false);
        return;
      }

      // eslint-disable-next-line no-unused-vars
      const recaptchaToken = await window.grecaptcha.execute(
        process.env.REACT_APP_RECAPTCHA_SITE_KEY,
        { action: "reset_password" }
      );
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);

      if (signInMethods.length === 0) {
        setError("Non esiste alcun account con questa email.");
        setTimeout(() => setError(false), 3000);
        setLoading(false);
        return;
      }
      await sendPasswordResetEmail(auth, email);
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        setError("Non esiste alcun account con questa email.");
        setTimeout(() => setError(false), 3000);
      } else if (error.code === "auth/invalid-email") {
        setError("Formato email non valido.");
        setTimeout(() => setError(false), 3000);
      } else {
        setError(
          "Errore durante l'invio dell'email di reimpostazione della password."
        );
        setTimeout(() => setError(false), 3000);
      }
      console.error("Error sending reset email: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form id="login-form" className="bg-section">
        <div className=" mb-4">
          <h3 className="mb-4">Login con:</h3>
          <div className="mb-4 d-flex justify-content-center">
            <GoogleSignIn></GoogleSignIn>
          </div>
        </div>
        <div className="separator">
          <span>Oppure</span>
        </div>
        <Form.Group className="d-flex flex-column w-100">
          <Form.Label className=" ">
            <Envelope className="me-3"></Envelope> Email
          </Form.Label>
          <Form.Control
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          ></Form.Control>
        </Form.Group>
        <Form.Group className="d-flex flex-column w-100 mb-3 password-input-group">
          <Form.Label className=" mt-3">
            <Key className="me-3"></Key> Password
          </Form.Label>
          <div className="password-wrapper">
            <Form.Control
              required
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
            <div className="password-icon2" onClick={toggleShowPassword}>
              {showPassword ? <EyeSlash /> : <Eye />}
            </div>
          </div>
        </Form.Group>
        <span onClick={handleResetPassword} style={{ fontSize: "0.7rem" }}>
          Hai dimenticato la password?
          {loading && (
            <Spinner
              animation="border"
              size="sm"
              style={{ marginLeft: "10px" }}
            />
          )}
        </span>
        <div className="text-end mt-4">
          <Button className="rounded-3 px-3 w-100" onClick={handleLogin}>
            Login
          </Button>
        </div>
      </Form>
      {showAlert &&
        ReactDOM.createPortal(
          <Alert
            variant="danger"
            onClose={() => setShowAlert(false)}
            dismissible
            style={{
              position: "fixed",
              bottom: "80px",
              right: "45px",
              zIndex: 1000,
            }}
          >
            Email o Password errati! Riprova!
          </Alert>,
          document.getElementById("alert-root")
        )}
      {error &&
        ReactDOM.createPortal(
          <Alert
            variant="danger"
            onClose={() => setError("")}
            dismissible
            style={{
              position: "fixed",
              bottom: "40px",
              right: "5px",
              left: "5px",
              zIndex: 1000,
            }}
          >
            {error}
          </Alert>,
          document.getElementById("alert-root")
        )}
      {resetSuccess &&
        ReactDOM.createPortal(
          <Alert
            variant="success"
            onClose={() => setResetSuccess(false)}
            dismissible
            style={{
              position: "fixed",
              bottom: "40px",
              right: "5px",
              left: "5px",
              zIndex: 1000,
            }}
          >
            Email di reimpostazione della password inviata!
          </Alert>,
          document.getElementById("alert-root")
        )}
    </>
  );
};

export default LoginPage;
