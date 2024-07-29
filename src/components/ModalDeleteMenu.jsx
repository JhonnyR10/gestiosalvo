import { deleteDoc, doc, getDoc } from "firebase/firestore";

import { db } from "../firebaseConfig";
import { Button, Modal } from "react-bootstrap";

const ModalDeleteMenu = ({ id, show, onHide, menuName }) => {
  const handleDelete = async () => {
    try {
      const menuRef = doc(db, "menu", id);
      const menuDoc = await getDoc(menuRef);

      if (menuDoc.exists) {
        await deleteDoc(menuRef);
        console.log(`Fornitore ${id} eliminato con successo`);

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
        Vuoi davvero eliminare il menu: <b>{menuName}</b>?{" "}
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
export default ModalDeleteMenu;
