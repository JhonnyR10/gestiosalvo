import React from "react";
import { Button, Modal } from "react-bootstrap";
import { db } from "../firebaseConfig";

const DeleteProductModal = ({ show, onHide, productId, supplierId }) => {
  const handleDelete = async () => {
    try {
      // Aggiorna la lista dei prodotti del fornitore
      const supplierRef = db.collection("fornitori").doc(supplierId);
      const supplierDoc = await supplierRef.get();
      //   Elimina il prodotto dal database
      await db.collection("prodotti").doc(productId).delete();
      console.log(`Prodotto con ID ${productId} eliminato dal database.`);

      if (supplierDoc.exists) {
        const supplierData = supplierDoc.data();
        console.log("Prodotti attuali del fornitore:", supplierData.products);

        // Filtra l'array dei prodotti per rimuovere il prodotto eliminato
        const updatedProducts = supplierData.products.filter(
          (product) => product.id !== productId
        );
        console.log("Prodotti aggiornati del fornitore:", updatedProducts);

        // Aggiorna il documento del fornitore con l'array dei prodotti aggiornato
        await supplierRef.update({ products: updatedProducts });
        console.log(
          `Lista dei prodotti del fornitore con ID ${supplierId} aggiornata.`
        );
      }

      onHide(); // Chiudi il modale dopo l'eliminazione
    } catch (error) {
      console.error("Errore durante l'eliminazione del prodotto:", error);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Elimina Prodotto</Modal.Title>
      </Modal.Header>
      <Modal.Body>Sei sicuro di voler eliminare questo prodotto?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Chiudi
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Elimina
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteProductModal;
