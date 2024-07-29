import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { db } from "../firebaseConfig";
import { Button, Form, Modal } from "react-bootstrap";

const EditMenuProductModal = ({ show, onHide, product, menuId }) => {
  const [productName, setProductName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [category, setCategory] = useState(product.category);

  const handleEdit = async () => {
    try {
      // Aggiorna la lista dei prodotti del fornitore
      const menuRef = doc(db, "menu", menuId);
      const menuDoc = await getDoc(menuRef);

      if (menuDoc.exists) {
        const menuData = menuDoc.data();
        const updatedProducts = menuData.products.map((p) =>
          p.name === product.name &&
          p.price === product.price &&
          p.category === product.category
            ? { ...p, name: productName, price: price, category: category }
            : p
        );

        await updateDoc(menuRef, { products: updatedProducts });
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
          <Form.Group controlId="formProductPrice" className="mb-2">
            <Form.Label>Prezzo del Prodotto</Form.Label>
            <Form.Control
              type="number"
              placeholder="Inserisci il prezzo"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="productCategory" className="mb-2">
            <Form.Label>Categoria Prodotto</Form.Label>
            <Form.Control
              as="select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Seleziona la categoria del prodotto</option>
              <option value="BAR">BAR</option>
              <option value="DRINK">DRINK</option>
              <option value="FOOD">FOOD</option>
              <option value="GELATI">GELATI</option>
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
export default EditMenuProductModal;
