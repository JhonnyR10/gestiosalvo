import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const AddCreditModal = ({ show, onHide, clientId, currentCredit }) => {
  const [credit, setCredit] = useState(0);

  const handleCreditChange = (e) => {
    setCredit(Number(e.target.value));
  };

  const handleSaveCredit = async () => {
    const clientRef = doc(db, "clienti", clientId);
    try {
      await updateDoc(clientRef, {
        credit: currentCredit + credit,
      });
      setCredit(0);
      onHide();
    } catch (error) {
      console.error("Errore durante l'aggiornamento del credito:", error);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Aggiungi Credito</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Importo del Credito</Form.Label>
            <Form.Control
              type="number"
              placeholder="Inserisci il prezzo"
              step="0.01"
              min="0"
              value={credit}
              onChange={handleCreditChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Annulla
        </Button>
        <Button variant="primary" onClick={handleSaveCredit}>
          Salva
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddCreditModal;
