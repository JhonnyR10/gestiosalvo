import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useAuth } from "../AuthProvider";
import {
  Envelope,
  Eye,
  EyeSlash,
  InfoCircle,
  Key,
  Person,
} from "react-bootstrap-icons";
import ReactDOM from "react-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const registraUtente = async (e) => {
    e.preventDefault();
    try {
      await signup(email, password, username);
      navigate("/home");
    } catch (error) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      console.error("Error signing up: ", error);
    }
  };
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <>
      <Form id="register-form" className="bg-section" onSubmit={registraUtente}>
        <h2 className="border-bottom border-primary pb-3 mb-4">Registrati</h2>

        <Form.Group className="d-flex flex-column w-100">
          <Form.Label className="">
            {" "}
            <Person className="me-3 fs-3 ms-1"></Person>Username
          </Form.Label>
          <Form.Control
            placeholder="username"
            className="w-100 m-auto"
            required
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="d-flex flex-column w-100 mt-2">
          <Form.Label className="">
            {" "}
            <Envelope className="me-3 fs-4 ms-1"></Envelope> Email
          </Form.Label>
          <Form.Control
            placeholder="example@email.it"
            className="w-100 m-auto"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="d-flex flex-column w-100 password-input-group">
          <Form.Label className="mt-2">
            <div className="d-flex justify-content-between align-items-center">
              <Key className="me-3 fs-4 ms-1"></Key> Password{" "}
              <OverlayTrigger
                placement="bottom"
                overlay={
                  <Tooltip id="button-tooltip-2">
                    La password deve essere minimo 6 caratteri
                  </Tooltip>
                }
              >
                <InfoCircle className="ms-auto me-2"></InfoCircle>
              </OverlayTrigger>
            </div>
          </Form.Label>
          <div className="password-wrapper">
            <Form.Control
              placeholder="password"
              className="w-100 m-auto"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            ></Form.Control>
            <div className="password-icon" onClick={toggleShowPassword}>
              {showPassword ? <EyeSlash /> : <Eye />}
            </div>
          </div>
        </Form.Group>

        <div className=" mt-4 ">
          <Button className=" w-100 rounded-3 px-3 " type="submit">
            Registrati
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
              right: "1px",
              zIndex: 1000,
            }}
          >
            Errore nella registrazione! Inserisci email e password valide.
          </Alert>,
          document.getElementById("alert-root")
        )}
    </>
  );
};
export default Register;
