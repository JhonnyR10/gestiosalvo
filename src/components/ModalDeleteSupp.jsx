import { Button, Modal } from "react-bootstrap";
import { db } from "../firebaseConfig";
import { useLocation, useNavigate } from "react-router";

const ModalDeleteSupp = ({ id, show, onHide, suppName }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await db.collection("fornitori").doc(id).delete();
      if (location.pathname.startsWith("/listSupp/")) {
        navigate("/listSupp");
      }
      onHide();
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
