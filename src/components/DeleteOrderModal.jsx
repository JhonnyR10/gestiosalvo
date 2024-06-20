import { Button, Modal } from "react-bootstrap";
import { db } from "../firebaseConfig";
import { useLocation, useNavigate } from "react-router";

const DeleteOrderModal = ({ show, onHide, orderId }) => {
  const handleDelete = async () => {
    try {
      await db.collection("ordini").doc(orderId).delete();
      console.log(`Ordinecon ID ${orderId} eliminato dal database.`);

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
      <Modal.Body>Sei sicuro di voler eliminare questo Ordine?</Modal.Body>
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
export default DeleteOrderModal;
