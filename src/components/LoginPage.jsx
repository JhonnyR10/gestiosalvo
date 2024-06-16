import { useEffect, useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAccessToken } from "../redux/actions";

const LoginPage = () => {
  const [user, setUser] = useState(null);
  const [password, setPassword] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showAlert, setShowAlert] = useState(false);
  const accessToken = useSelector((state) => state.user.accessToken);

  const goToProfile = (e) => {
    e.preventDefault();
    dispatch(setAccessToken(user, password));
    if (!accessToken && user && password) {
      setShowAlert(true);
    }
  };

  useEffect(() => {
    if (accessToken) {
      navigate("/home");
    }
  }, [accessToken, navigate, user, password]);

  return (
    <div className="card-container d-flex justify-content-center align-items-center">
      <Card className="login-card ms-auto me-auto">
        <Card.Body>
          <div className="d-flex justify-content-center mb-3"></div>
          <Card.Title className="mb-4 fs-3">Accedi</Card.Title>
          <Form onSubmit={goToProfile}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Inserisci il tuo Username"
                onChange={(e) => setUser(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {showAlert && (
                <Alert
                  className="mt-3"
                  variant="danger"
                  onClose={() => setShowAlert(false)}
                  dismissible
                >
                  Password e/o Username errati
                </Alert>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check type="checkbox" label="Ricordami" />
            </Form.Group>
            <div className="d-flex justify-content-center align-items-center">
              <Button
                variant="primary"
                type="submit"
                className="custom-button py-2"
              >
                Accedi
              </Button>
            </div>
          </Form>
          <Card.Link href="#" className="d-block mt-5">
            Password dimenticata?
          </Card.Link>
        </Card.Body>
      </Card>
    </div>
  );
};
export default LoginPage;
