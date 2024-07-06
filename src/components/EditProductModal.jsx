import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { db } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const EditProductModal = ({ show, onHide, product, supplierId }) => {
  const [productName, setProductName] = useState(product.name);
  const [unitOfMeasure, setUnitOfMeasure] = useState(product.unitOfMeasure);

  const handleEdit = async () => {
    try {
      // Aggiorna il prodotto nel database
      const productRef = doc(db, "prodotti", product.id);
      await updateDoc(productRef, {
        name: productName,
        unitOfMeasure,
      });

      // Aggiorna la lista dei prodotti del fornitore
      const supplierRef = doc(db, "fornitori", supplierId);
      const supplierDoc = await getDoc(supplierRef);

      if (supplierDoc.exists) {
        const supplierData = supplierDoc.data();
        const updatedProducts = supplierData.products.map((p) =>
          p.id === product.id ? { ...p, name: productName, unitOfMeasure } : p
        );

        await updateDoc(supplierRef, { products: updatedProducts });
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
              <option value="BT">Bottiglia</option>
              <option value="CT">Cartone</option>
              <option value="CF">Confezione</option>
              <option value="PZ">Pezzo</option>
              <option value="FS">Fusto</option>
              <option value="FL">Flacone</option>
              <option value="CS">Cassa</option>
              <option value="TN">Tanica</option>
              <option value="RT">Rotolo</option>
              <option value="KG">Kilogrammo</option>
              <option value="GR">Grammo</option>
              <option value="LT">Litro</option>
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
