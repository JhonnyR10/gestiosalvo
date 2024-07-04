import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { useAuth } from "../AuthProvider";
import { Envelope, Key, Person } from "react-bootstrap-icons";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [username, setUsername] = useState("");

  const navigate = useNavigate();
  const { signup } = useAuth();

  const registraUtente = async (e) => {
    e.preventDefault();
    try {
      await signup(email, password, username);
      navigate("/home");
    } catch (error) {
      console.error("Error signing up: ", error);
    }
  };

  return (
    <Form id="register-form" className="bg-section">
      <h2 className="border-bottom border-primary pb-3 mb-4">Registrati</h2>

      <Form.Group className="d-flex flex-column w-100">
        <Form.Label className="">
          {" "}
          <Person className="me-3"></Person> Username
        </Form.Label>
        <Form.Control
          className="w-100 m-auto"
          required
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        ></Form.Control>
      </Form.Group>

      <Form.Group className="d-flex flex-column w-100">
        <Form.Label className="">
          {" "}
          <Envelope className="me-3"></Envelope> Email
        </Form.Label>
        <Form.Control
          className="w-100 m-auto"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        ></Form.Control>
      </Form.Group>

      <Form.Group className="d-flex flex-column w-100">
        <Form.Label className="mt-2">
          <Key className="me-3"></Key> Password
        </Form.Label>
        <Form.Control
          className="w-100 m-auto"
          type="password"
          required
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        ></Form.Control>
      </Form.Group>

      <div className="text-end mt-3 ">
        <Button
          className=" rounded-3 px-3 btnEdit btnLR"
          onClick={registraUtente}
        >
          Registrati
        </Button>
      </div>

      {/* <InputGroup className="d-flex flex-column w-100">
          <Form.Label className="text-center mt-2">Ruolo</Form.Label>
        </InputGroup> */}
      {/* <Form.Select
        value={role}
        onChange={(e) => {
          setRole(e.target.value);
        }}
      >
        <option>USER</option>
        <option>ADMIN</option>
      </Form.Select> */}
    </Form>
  );
};
export default Register;
