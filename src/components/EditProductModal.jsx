import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { db } from "../firebaseConfig";

const EditProductModal = ({ show, onHide, product, supplierId }) => {
  const [productName, setProductName] = useState(product.name);
  const [unitOfMeasure, setUnitOfMeasure] = useState(product.unitOfMeasure);

  const handleEdit = async () => {
    try {
      // Aggiorna il prodotto nel database
      await db.collection("prodotti").doc(product.id).update({
        name: productName,
        unitOfMeasure,
      });

      // Aggiorna la lista dei prodotti del fornitore
      const supplierRef = db.collection("fornitori").doc(supplierId);
      const supplierDoc = await supplierRef.get();

      if (supplierDoc.exists) {
        const supplierData = supplierDoc.data();
        const updatedProducts = supplierData.products.map((p) =>
          p.id === product.id ? { ...p, name: productName, unitOfMeasure } : p
        );

        await supplierRef.update({ products: updatedProducts });
      }
      console.log("Prodotto modificato correttamente!");
      onHide(); // Chiudi il modale dopo la modifica
    } catch (error) {
      console.error("Errore durante la modifica del prodotto:", error);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Modifica Prodotto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="productName">
            <Form.Label>Nome Prodotto</Form.Label>
            <Form.Control
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Inserisci il nome del prodotto"
            />
          </Form.Group>
          <Form.Group controlId="unitOfMeasure">
            <Form.Label>Unità di Misura</Form.Label>
            <Form.Control
              as="select"
              value={unitOfMeasure}
              onChange={(e) => setUnitOfMeasure(e.target.value)}
            >
              <option value="">Seleziona l'unità di misura</option>
              <option value="Bottiglia">Bottiglia</option>
              <option value="Cartone">Cartone</option>
              <option value="Confezione">Confezione</option>
              <option value="Pezzo">Pezzo</option>
              <option value="Fusto">Fusto</option>
              <option value="Flacone">Flacone</option>
              <option value="Cassa">Cassa</option>
              <option value="Tanica">Tanica</option>
              <option value="Rotolo">Rotolo</option>
              <option value="Kilogrammo">Kilogrammo</option>
              <option value="Grammo">Grammo</option>
              <option value="Litro">Litro</option>
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Chiudi
        </Button>
        <Button variant="primary" onClick={handleEdit}>
          Salva Modifiche
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditProductModal;
