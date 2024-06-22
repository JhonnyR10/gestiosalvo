import React, { useEffect, useState } from "react";
import { Button, Modal, Form, ModalHeader } from "react-bootstrap";
import { db } from "../firebaseConfig";
import { CardList, Plus } from "react-bootstrap-icons";

const AddProductModal = ({ show, onHide }) => {
  const [productName, setProductName] = useState("");
  const [unitOfMeasure, setUnitOfMeasure] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      console.log("Fetching suppliers...");
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

  const handleAddProduct = async (event) => {
    event.preventDefault();
    if (!productName || !unitOfMeasure || !supplierId) {
      alert("Per favore, compila tutti i campi obbligatori.");
      return;
    }
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
      {/* <Modal.Header closeButton></Modal.Header> */}
      <Modal.Header
        closeButton
        className="d-flex justify-content-center align-items-center pb-4 w-100 border-bottom border-3 border-primary"
      >
        <Plus className="col-3"></Plus>
        <Modal.Title className=" col-9 fs-3 m-0">Aggiungi prodotto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleAddProduct}>
          <Form.Group controlId="productName">
            <Form.Label>Nome Prodotto</Form.Label>
            <Form.Control
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Inserisci il nome del prodotto"
              required
            />
          </Form.Group>
          <Form.Group controlId="unitOfMeasure">
            <Form.Label>Unità di Misura</Form.Label>
            <Form.Control
              as="select"
              value={unitOfMeasure}
              onChange={(e) => setUnitOfMeasure(e.target.value)}
              required
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
          <Form.Group controlId="supplierId">
            <Form.Label>Fornitore</Form.Label>
            <Form.Control
              as="select"
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              required
            >
              <option value="">Seleziona un fornitore</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Modal.Footer>
            <Button variant="primary" type="submit">
              Aggiungi Prodotto
            </Button>
            <Button variant="secondary" onClick={onHide}>
              Chiudi
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddProductModal;
