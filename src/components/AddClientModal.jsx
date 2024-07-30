import { useState } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { Plus } from "react-bootstrap-icons";
import { useAuth } from "../AuthProvider";
import { db } from "../firebaseConfig";
import { addDoc, collection } from "firebase/firestore";

const AddClientModal = ({ show, onHide }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [category, setCategory] = useState();
  const { currentUser } = useAuth();

  const handleAddClient = async (event) => {
    event.preventDefault();
    const time = new Date();
    setIsLoading(true);
    try {
      const clientData = {
        name: name,
        surname: surname,
        phoneNumber: phoneNumber,
        createdAt: time,
        createdBy: currentUser.displayName,
        category: category,
        accounts: [],
      };
      const docRef = await addDoc(collection(db, "clienti"), clientData);
      // eslint-disable-next-line no-unused-vars
      const clientRef = docRef.id;
      setName("");
      setSurname("");
      setPhoneNumber("");
      setCategory("");
      setIsLoading(false);
      onHide();
    } catch (error) {
      console.error("Errore durante l'aggiunta del cliente:", error);
    }
  };
  return (
    <Modal show={show} onHide={onHide} centered>
      {/* <Modal.Header closeButton></Modal.Header> */}
      <Modal.Header
        closeButton
        className="d-flex justify-content-center align-items-center pb-4 w-100 border-bottom border-3 border-primary"
      >
        <Plus className="col-2"></Plus>
        <Modal.Title className=" col-8 text-center fs-3 m-0">
          Aggiungi Cliente
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading ? (
          <div
            className="d-flex flex-column justify-content-center align-items-center"
            style={{ height: "200px" }}
          >
            <Spinner
              animation="border"
              role="status"
              variant="primary"
            ></Spinner>
            <div className="sr-only">Salvando il cliente...</div>
          </div>
        ) : (
          <Form onSubmit={handleAddClient}>
            <Form.Group controlId="clientName" className="mb-2">
              <Form.Label>Nome Cliente</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Inserisci il nome del cliente"
                required
              />
            </Form.Group>
            <Form.Group controlId="clientSurname" className="mb-2">
              <Form.Label>Cognome Cliente</Form.Label>
              <Form.Control
                type="text"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                placeholder="Inserisci il cognome del cliente"
              />
            </Form.Group>
            <Form.Group controlId="clientPhoneNumber" className="mb-2">
              <Form.Label>Numero di telefono</Form.Label>
              <Form.Control
                type="phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Inserisci il numero di telefono"
              />
            </Form.Group>
            <Form.Group controlId="productCategory" className="mb-2">
              <Form.Label>Categoria Cliente</Form.Label>
              <Form.Control
                as="select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Seleziona la categoria del cliente</option>
                <option value="CLIENTE">CLIENTE</option>
                <option value="DIPENDENTE">DIPENDENTE</option>
              </Form.Control>
            </Form.Group>

            <Modal.Footer className="border-0">
              <Button variant="primary" type="submit">
                Salva Cliente
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};
export default AddClientModal;
