import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { db } from "../firebaseConfig";

const ModalEditMenu = ({ id, show, onHide, menudata }) => {
  const [menu, setMenu] = useState({
    name: menudata.name,
    category: menudata.category,
  });

  const handleInputChange = (property, value) => {
    setMenu({
      ...menu,
      [property]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const menuRef = doc(db, "menu", id);
      await updateDoc(menuRef, menu);
      onHide();
    } catch (error) {
      console.error("Errore durante la modifica del fornitore:", error);
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
        <Modal.Title>Modifica</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Modifica il fornitore <b>{menudata.name}</b>{" "}
        <Form onSubmit={handleSubmit} className="w-100">
          <Form.Group className="mb-3">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={menu.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="menuName" className="mb-3">
            <Form.Label>Categoria menù</Form.Label>
            <Form.Control
              as="select"
              value={menu.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              required
            >
              <option value="CLIENTE">CLIENTE</option>
              <option value="DIPENDENTE">DIPENDENTE</option>
            </Form.Control>
          </Form.Group>
          <Button variant="primary" type="submit">
            Salva Modifiche
          </Button>
        </Form>
      </Modal.Body>
      {/* <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Chiudi
        </Button>
        <Button variant="warning" onClick={handleSubmit}>
          Modifica
        </Button>
      </Modal.Footer> */}
    </Modal>
  );
};
export default ModalEditMenu;
