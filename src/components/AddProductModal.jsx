import React, { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { db } from "../firebaseConfig";

const AddProductModal = ({ show, onHide }) => {
  const [productName, setProductName] = useState("");
  const [unitOfMeasure, setUnitOfMeasure] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const suppliersCollection = await db.collection("fornitori").get();
        const suppliersData = suppliersCollection.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSuppliers(suppliersData);
      } catch (error) {
        console.error("Errore durante il recupero dei fornitori:", error);
      }
    };

    fetchSuppliers();
  }, []);

  const handleAddProduct = async () => {
    try {
      // Aggiungi il prodotto al database
      const productRef = await db.collection("prodotti").add({
        name: productName,
        unitOfMeasure,
        supplierId,
      });

      // Aggiorna la lista dei prodotti del fornitore selezionato
      const supplierRef = db.collection("fornitori").doc(supplierId);
      const supplierDoc = await supplierRef.get();

      if (supplierDoc.exists) {
        const supplierData = supplierDoc.data();
        const updatedProducts = [
          ...supplierData.products,
          { name: productName, unitOfMeasure, id: productRef.id },
        ];

        await supplierRef.update({ products: updatedProducts });
      }
      setProductName("");
      setSupplierId("");
      setUnitOfMeasure("");
      onHide(); // Chiudi il modale dopo l'aggiunta
    } catch (error) {
      console.error("Errore durante l'aggiunta del prodotto:", error);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Aggiungi Prodotto</Modal.Title>
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
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="supplierId">
            <Form.Label>Fornitore</Form.Label>
            <Form.Control
              as="select"
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
            >
              <option value="">Seleziona un fornitore</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Chiudi
        </Button>
        <Button variant="primary" onClick={handleAddProduct}>
          Aggiungi Prodotto
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddProductModal;
