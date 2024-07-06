import { useState } from "react";
import { db } from "../firebaseConfig";
import { Button, Form, Modal } from "react-bootstrap";
import { doc, updateDoc } from "firebase/firestore";

const ModalEditSupp = ({ id, show, onHide, supp }) => {
  const [supplier, setSupplier] = useState({
    name: supp.name,
    phoneNumber: supp.phoneNumber,
  });

  const handleInputChange = (property, value) => {
    setSupplier({
      ...supplier,
      [property]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const supplierRef = doc(db, "fornitori", id);
      await updateDoc(supplierRef, supplier);
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
        Modifica il fornitore <b>{supp.name}</b>{" "}
        <Form onSubmit={handleSubmit} className="w-100">
          <Form.Group className="mb-3">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={supplier.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Telefono</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={supplier.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              required
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
export default ModalEditSupp;
