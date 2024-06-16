import { Button, Modal } from "react-bootstrap";
import { db } from "../firebaseConfig";
import { useLocation, useNavigate } from "react-router";

const ModalDeleteSupp = ({ id, show, onHide, suppName }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      const supplierRef = db.collection("fornitori").doc(id);
      const supplierDoc = await supplierRef.get();

      if (supplierDoc.exists) {
        const supplierData = supplierDoc.data();
        const products = supplierData.products || [];

        // Elimina ogni prodotto nella lista del fornitore
        const deleteProductPromises = products.map((product) =>
          db.collection("prodotti").doc(product.id).delete()
        );

        // Attendi che tutte le eliminazioni siano completate
        await Promise.all(deleteProductPromises);

        // Elimina il documento del fornitore
        await supplierRef.delete();

        if (location.pathname.startsWith("/listSupp/")) {
          navigate("/listSupp");
        }
        onHide();
      } else {
        console.error("Il documento del fornitore non esiste.");
      }
    } catch (error) {
      console.error("Errore durante l'eliminazione del fornitore:", error);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Elimina</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Vuoi davvere eliminare il fornitore <b>{suppName}</b>?{" "}
      </Modal.Body>
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
export default ModalDeleteSupp;
