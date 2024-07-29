import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { db } from "../firebaseConfig";

const EditClientModal = ({ id, show, onHide, clientData }) => {
  const [client, setClient] = useState({
    name: clientData.name,
    surname: clientData.surname ? clientData.surname : "",
    phoneNumber: clientData.phoneNumber,
  });

  const handleInputChange = (property, value) => {
    setClient({
      ...client,
      [property]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const clientRef = doc(db, "clienti", id);
      await updateDoc(clientRef, client);
      onHide();
    } catch (error) {
      console.error("Errore durante la modifica del fornitore:", error);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Modifica</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Modifica il fornitore <b>{clientData.name}</b>{" "}
        <Form onSubmit={handleSubmit} className="w-100">
          <Form.Group className="mb-3">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={client.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Cognome</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={client.surname}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Telefono</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={client.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Salva Modifiche
          </Button>
        </Form>
      </Modal.Body>
      {/* <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Chiudi
        </Button>
        <Button variant="warning" onClick={handleSubmit}>
          Modifica
        </Button>
      </Modal.Footer> */}
    </Modal>
  );
};
export default EditClientModal;
