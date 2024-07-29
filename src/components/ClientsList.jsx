import Navbar from "./Navbar";
import logo from "../logoGestioSalvo2.png";
import { Card, Form, Table, Spinner } from "react-bootstrap";
import { Eye, Pencil, Plus, Trash } from "react-bootstrap-icons";
import { useEffect, useState } from "react";
import AddClientModal from "./AddClientModal";
import BackToTopButton from "./BackToTopButton";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useNavigate } from "react-router";
import EditClientModal from "./EditClientModal";

const ClientsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const handleShowAddClientModal = () => setShowAddClientModal(true);
  const handleCloseAddClientModal = () => setShowAddClientModal(false);
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleShowEdit = (client) => {
    setSelectedClient(client);
    setShowEdit(true);
  };

  const handleCloseEdit = () => {
    setShowEdit(false);
    setSelectedClient(null);
  };

  const handleShowDelete = (client) => {
    setSelectedClient(client);
    setShowDelete(true);
  };

  const handleCloseDelete = () => {
    setShowDelete(false);
    setSelectedClient(null);
  };

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      setError(null);
      try {
        const clientsSnapshot = await getDocs(collection(db, "clienti"));
        const clientsList = clientsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setClients(clientsList);
      } catch (error) {
        console.log("Errore durante il recupero dei clienti", error);
        setError("Failed to load clients");
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, [showAddClientModal]);

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.surname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="d-flex flex-column align-items-center justify-content-center mt-1">
        <img className="logo" src={logo} alt="logo" />
        <Card className="login-card mb-4">
          <Card.Body className="p-0 py-4">
            <div className="d-flex flex-column justify-content-center align-items-center mb-3">
              <div className="border-bottom border-3 border-primary w-100 mb-4">
                <Card.Title className="mb-4 fs-3 text-center">
                  Conti Clienti
                </Card.Title>
              </div>
              <div className="d-flex flex-column justify-content-start">
                <div className="d-flex align-items-center">
                  <Plus />
                  <p
                    className="ms-2 nav-link mb-0"
                    onClick={handleShowAddClientModal}
                  >
                    Aggiungi Cliente
                  </p>
                </div>
                <AddClientModal
                  show={showAddClientModal}
                  onHide={handleCloseAddClientModal}
                />
                <Form.Group controlId="formSearch" className="mt-3">
                  <Form.Label className="ms-1">Cerca per Nome</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Cerca cliente"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </Form.Group>
              </div>
            </div>
          </Card.Body>
        </Card>

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : error ? (
          <div className="text-center text-danger">{error}</div>
        ) : filteredClients.length > 0 ? (
          <div className="container text-center">
            <div className="row row-cols-1 g-2">
              {filteredClients.map((client, index) => (
                <Card key={index} className="col">
                  <Card.Body className="">
                    <div className="d-flex justify-content-between align-items-center pb-2">
                      <Card.Title
                        className=" m-0"
                        onClick={() => navigate(`/menuList/${client.id}`)}
                      >
                        {client.name} {client.surname}
                      </Card.Title>
                      <Eye
                        className=""
                        onClick={() => navigate(`/menuList/${client.id}`)}
                      ></Eye>
                    </div>
                    <div className="d-flex justify-content-between align-items-center pb-2">
                      <p className="mb-0">
                        Conti: {client.products ? client.products.length : 0}
                      </p>
                      <Pencil
                        className="text-warning"
                        onClick={() => handleShowEdit(client)}
                      ></Pencil>
                    </div>
                    <div className="d-flex justify-content-between align-items-center pb-2">
                      <p className="m-0">Creato da: {client.createdBy}</p>
                      <Trash
                        className="text-danger"
                        // onClick={() => handleShowDelete(menu)}
                      ></Trash>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <p> Nessun cliente trovato</p>
        )}

        {selectedClient && (
          <>
            {/* <ModalDeleteMenu
              id={selectedMenu.id}
              show={showDelete}
              onHide={handleCloseDelete}
              menuName={selectedMenu.name}
            /> */}
            <EditClientModal
              id={selectedClient.id}
              show={showEdit}
              onHide={handleCloseEdit}
              clientData={selectedClient}
            />
          </>
        )}
      </div>
      <BackToTopButton />
    </>
  );
};

export default ClientsList;
// <Table striped bordered hover responsive size="sm">
//   <thead>
//     <tr>
//       <th className="text-center">#</th>
//       <th className="text-center">Nome</th>
//       <th className="text-center">Cognome</th>
//       <th className="text-center">Numero di telefono</th>
//       <th className="text-center">Numero di prodotti</th>
//     </tr>
//   </thead>
//   <tbody>
//     {filteredClients.length > 0 ? (
//       filteredClients.map((client, index) => (
//         <tr key={client.id}>
//           <td className="align-middle">
//             <div className="text-center d-flex justify-content-around align-items-center">
//               <div className="border-end pe-2">{index + 1}</div>
//               <div className="d-flex flex-column justify-content-around align-items-center">
//                 <Pencil className="text-warning" />
//                 <Trash className="text-danger" />
//               </div>
//             </div>
//           </td>
//           <td className="align-middle">{client.name}</td>
//           <td className="text-center align-middle">
//             {client.surname}
//           </td>
//           <td className="align-middle">{client.phoneNumber}</td>
//           <td className="text-center align-middle">
//             {client.products ? client.products.length : "N/A"}
//           </td>
//         </tr>
//       ))
//     ) : (
//       <tr>
//         <td colSpan="5" className="text-center">
//           Nessun conto cliente disponibile
//         </td>
//       </tr>
//     )}
//   </tbody>
// </Table>
