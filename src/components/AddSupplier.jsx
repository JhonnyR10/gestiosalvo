import React, { useState } from "react";
import { db } from "../firebaseConfig"; // Importa l'istanza di Firestore
import { Alert, Button, Card, CardBody, Form } from "react-bootstrap";
import Navbar from "./Navbar";

const AddSupplier = () => {
  const [supplierName, setSupplierName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const handleAddSupplier = async () => {
    try {
      await db.collection("fornitori").add({
        name: supplierName,
        phoneNumber: phoneNumber,
        products: [], // Inizialmente nessun prodotto associato
      });
      console.log("Fornitore aggiunto con successo!");
      setSupplierName("");
      setPhoneNumber("");
      setShowAlert(true);

      // Aggiornare lo stato o mostrare un messaggio di successo
    } catch (error) {
      console.error("Errore durante l'aggiunta del fornitore:", error);
      // Gestire l'errore, mostrare un messaggio all'utente, ecc.
    }
  };

  return (
    <>
      <Navbar />
      <div className=" d-flex flex-column align-items-center justify-content-center mt-5">
        <Card className="login-card mb-4 border-0">
          <CardBody className="p-0 pt-4">
            <div className="d-flex flex-column justify-content-center align-items-center">
              <div className="border-bottom border-3 border-primary w-100 mb-4">
                <Card.Title className="mb-4 fs-3 text-center">
                  Aggiungi Fornitore
                </Card.Title>
              </div>

              <Form className="d-flex flex-column justify-content-center align-items-center w-100">
                <Form.Group className="mb-3">
                  <Form.Label>Nome Fornitore</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Inserisci il nome del fornitore"
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Numero di telefono</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Inserisci il numero del fornitore"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </Form.Group>
                <br />
                <div className="border-top border-3 border-primary w-100 d-flex flex-column justify-content-center align-items-center bg-dark pb-4 rounded-bottom-2 ">
                  <Button
                    variant="primary"
                    type="button"
                    className="custom-button py-2 mt-4"
                    onClick={handleAddSupplier}
                  >
                    Aggiungi Fornitore
                  </Button>
                  {showAlert && (
                    <Alert
                      className="mt-3"
                      variant="success"
                      onClose={() => setShowAlert(false)}
                      dismissible
                    >
                      Fornitore aggiunto con successo!
                    </Alert>
                  )}
                </div>
              </Form>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default AddSupplier;
