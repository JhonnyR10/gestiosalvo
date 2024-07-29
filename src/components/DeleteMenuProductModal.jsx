import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Button, Modal } from "react-bootstrap";

const DeleteMenuProductModal = ({ show, onHide, productData, menuId }) => {
  const handleDelete = async () => {
    try {
      // Aggiorna la lista dei prodotti del fornitore
      const menuRef = doc(db, "menu", menuId);
      const menuDoc = await getDoc(menuRef);

      if (menuDoc.exists) {
        const menuData = menuDoc.data();
        console.log("Prodotti attuali del menu:", menuData.products);

        // Filtra l'array dei prodotti per rimuovere il prodotto eliminato
        const updatedProducts = menuData.products.filter(
          (product) =>
            product.name !== productData.name ||
            product.price !== productData.price ||
            product.category !== productData.category
        );
        console.log("Prodotti aggiornati del menu:", updatedProducts);

        // Aggiorna il documento del fornitore con l'array dei prodotti aggiornato
        await updateDoc(menuRef, { products: updatedProducts });
        console.log(`Lista dei prodotti del menu con ID ${menuId} aggiornata.`);
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
export default DeleteMenuProductModal;
