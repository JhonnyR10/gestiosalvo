import { Button, Modal } from "react-bootstrap";
import { db } from "../firebaseConfig";
import { useLocation, useNavigate } from "react-router";
import { deleteDoc, doc, getDoc } from "firebase/firestore";

const ModalDeleteSupp = ({ id, show, onHide, suppName }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      const supplierRef = doc(db, "fornitori", id);
      const supplierDoc = await getDoc(supplierRef);

      if (supplierDoc.exists) {
        const supplierData = supplierDoc.data();
        const products = supplierData.products || [];

        // Controlla e logga i prodotti associati al fornitore
        console.log("Prodotti da eliminare:", products);

        // Elimina ogni prodotto nella lista del fornitore
        const deleteProductPromises = products.map(async (product) => {
          try {
            const productRef = doc(db, "prodotti", product.id);
            await deleteDoc(productRef);
            console.log(`Prodotto ${product.id} eliminato con successo`);
          } catch (error) {
            console.error(
              `Errore durante l'eliminazione del prodotto ${product.id}:`,
              error
            );
          }
        });

        // Attendi che tutte le eliminazioni siano completate
        await Promise.all(deleteProductPromises);

        // Elimina il documento del fornitore
        await deleteDoc(supplierRef);
        console.log(`Fornitore ${id} eliminato con successo`);

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
        Vuoi davvero eliminare il fornitore <b>{suppName}</b>?{" "}
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
