import { useEffect, useState } from "react";
import { Card, Table } from "react-bootstrap";
import { Eye, Pencil, Phone, Plus, Trash, Truck } from "react-bootstrap-icons";
import { useNavigate, useParams } from "react-router";
import AddAccountModal from "./AddAccountModal";
import BackToTopButton from "./BackToTopButton";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import Navbar from "./Navbar";
import SupplierPhoneNumber from "./SupplierPhoneNumber";
import AddCreditModal from "./AddCreditModal";

const ClientProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [showAddCreditModal, setShowAddCreditModal] = useState(false);

  const handleShowAddAccountModal = () => setShowAddAccountModal(true);
  const handleCloseAddAccountModal = () => setShowAddAccountModal(false);
  const handleShowAddCreditModal = () => setShowAddCreditModal(true);
  const handleCloseAddCreditModal = () => setShowAddCreditModal(false);

  useEffect(() => {
    const fetchClientAndAccounts = async () => {
      console.log("prima di fare troppe chiamate controllo l'useffect");
      try {
        const clientRef = doc(db, "clienti", id);
        const clientDoc = await getDoc(clientRef);
        if (clientDoc.exists()) {
          const clientData = clientDoc.data();
          setClient(clientData);
          console.log(client);

          if (clientData.accounts) {
            const accountsData = await Promise.all(
              clientData.accounts.map(async (accountId) => {
                const accountRef = doc(db, "conti", accountId); // Assumendo che gli ID dei conti siano salvati in `client.accounts`
                const accountDoc = await getDoc(accountRef);
                if (accountDoc.exists()) {
                  return { id: accountDoc.id, ...accountDoc.data() };
                } else {
                  return null;
                }
              })
            );
            setAccounts(accountsData.filter((account) => account !== null)); // Filtra eventuali null
          }
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Errore durante il recupero del cliente:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientAndAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, showAddAccountModal, showAddCreditModal]);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate(); // Converti il Timestamp in un oggetto Date
    return date.toLocaleDateString("it-IT", {
      // Formatta la data in un formato leggibile
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  const calculateTotalDebt = () => {
    return accounts.reduce((total, account) => {
      return account.active ? total + (account.total || 0) : total;
    }, 0);
  };

  if (loading) {
    return <p>Caricamento...</p>;
  }
  const totalDebt = calculateTotalDebt();
  const totalCredit = client ? client.credit : 0;

  return client ? (
    <>
      <Navbar />
      <div className=" d-flex flex-column align-items-center justify-content-center  mt-5">
        <Card className="login-card mb-4">
          <Card.Body className="p-0 py-4">
            <div className="d-flex flex-column justify-content-center align-items-center">
              <div className="d-flex row pb-1 mb-4 w-100 border-bottom border-3 border-primary">
                <span className="col-12 d-flex justify-content-center align-items-center mb-2">
                  <Truck className=" me-2"></Truck>
                  <Card.Title className=" fs-3 m-0">
                    {client.name} {client.surname}
                  </Card.Title>
                </span>
                <span className="col-12">
                  <div className="d-flex justify-content-center align-items-center">
                    <div className="col-6 border-end  py-2">
                      <div
                        className="d-flex justify-content-center align-items-center "
                        // onClick={() => handleShowEdit(client)}
                      >
                        <Pencil className="col-4 text-warning"></Pencil>
                        <p className="m-0 col-8 text-warning">Modifica</p>
                      </div>
                    </div>
                    <div className="col-6 py-2">
                      <div
                        className="d-flex justify-content-center align-items-center "
                        // onClick={() => handleShowDelete(client)}
                      >
                        <Trash className="col-4 text-danger"></Trash>
                        <p className="m-0 col-8 text-danger">Elimina</p>
                      </div>
                    </div>
                  </div>
                </span>
              </div>
              <div className="d-flex flex-column justify-content-center align-items-center w-100">
                <div className=" w-100 mb-4">
                  <div className="d-flex justify-content-center align-items-center pb-4">
                    <Phone className="col-2"></Phone>
                    <span className="col-6">
                      <SupplierPhoneNumber phoneNumber={client.phoneNumber} />
                    </span>
                    {/* <p>Telefono: {supplier.phoneNumber}</p> */}
                    <p className=" col-4 mb-0">
                      Conti: {client.accounts ? client.accounts.length : 0}
                    </p>
                  </div>
                  <div className="d-flex justify-content-center align-items-center">
                    <p className="col-5 m-0 text-center">
                      Totale Debito: €{totalDebt.toFixed(2)}
                    </p>
                    <p className="col-5 m-0 text-center">
                      Totale Credito: €{totalCredit.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className=" d-flex justify-content-between align-items-center w-100">
                  <Plus className="ms-2"></Plus>

                  <p className="mb-0 " onClick={handleShowAddAccountModal}>
                    Aggiungi Conto
                  </p>
                  <Plus className=""></Plus>

                  <p className="mb-0 me-2" onClick={handleShowAddCreditModal}>
                    Aggiungi Credito
                  </p>
                </div>
                <AddAccountModal
                  show={showAddAccountModal}
                  onHide={handleCloseAddAccountModal}
                />
                <AddCreditModal
                  show={showAddCreditModal}
                  onHide={handleCloseAddCreditModal}
                  clientId={id}
                  currentCredit={totalCredit}
                />
              </div>
            </div>
          </Card.Body>
        </Card>

        {accounts && accounts.length > 0 ? (
          <div className="container text-center">
            <div className="row row-cols-1 g-2">
              {accounts.map((account, index) => (
                <Card key={index} className="col">
                  <Card.Body className="">
                    <div className="d-flex justify-content-between align-items-center pb-2">
                      <Card.Title
                        className=" m-0"
                        onClick={() => navigate(`/listSupp/${account.id}`)}
                      >
                        {formatTimestamp(account.createdAt)}
                      </Card.Title>
                      <Eye
                        className=""
                        onClick={() => navigate(`/listSupp/${account.id}`)}
                      ></Eye>
                    </div>
                    <div className="d-flex justify-content-between align-items-center pb-2">
                      <p className="mb-0">Totale: {account.total} €</p>
                      <Pencil
                        className="text-warning"
                        // onClick={() => handleShowEdit(account)}
                      ></Pencil>
                    </div>
                    <div className="d-flex justify-content-between align-items-center pb-2">
                      {/* <p className="mb-0">
                        Cell: {account.phoneNumber ? account.phoneNumber : 0}
                      </p> */}

                      <p className="mb-0">
                        N° prodotti: {account.products.length}
                      </p>
                      <Trash
                        className="text-danger"
                        // onClick={() => handleShowDelete(account)}
                      ></Trash>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <li>Nessun prodotto disponibile</li>
        )}
      </div>

      {/* {selectedSupplier && (
              <>
                <ModalDeleteSupp
                  id={id}
                  show={showDelete}
                  onHide={handleCloseDelete}
                  suppName={selectedSupplier.name}
                />
                <ModalEditSupp
                  id={id}
                  show={showEdit}
                  onHide={handleCloseEdit}
                  supp={selectedSupplier}
                />
              </>
            )}
            {selectedProduct && (
              <>
                <EditProductModal
                  show={showEditModal}
                  onHide={handleCloseEditModal}
                  product={selectedProduct}
                  supplierId={id}
                />
                <DeleteProductModal
                  show={showDeleteModal}
                  onHide={handleCloseDeleteModal}
                  productId={selectedProduct.id}
                  supplierId={id}
                />
              </>
            )} */}

      <BackToTopButton />
    </>
  ) : null;
};
export default ClientProfile;
