import { useParams } from "react-router";
import BackToTopButton from "./BackToTopButton";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import Navbar from "./Navbar";
import { Card, Spinner, Table } from "react-bootstrap";
import { Pencil, Person, Plus, Trash, Truck } from "react-bootstrap-icons";
import ModalDeleteMenu from "./ModalDeleteMenu";
import ModalEditMenu from "./ModalEditMenu";
import EditMenuProductModal from "./EditMenuProductModal";
import DeleteMenuProductModal from "./DeleteMenuProductModal";
import AddMenuProductModal from "./AddMenuProductModal";

const MenuDetail = () => {
  const { id } = useParams();

  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleShowDeleteModal = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedProduct(null);
  };

  const handleShowEditModal = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedProduct(null);
  };
  /*------------------------------ */
  const handleShowDelete = (menu) => {
    setSelectedMenu(menu);
    setShowDelete(true);
  };

  const handleCloseDelete = () => {
    setShowDelete(false);
    setSelectedMenu(null);
  };

  const handleShowEdit = (menu) => {
    setSelectedMenu(menu);
    setShowEdit(true);
  };

  const handleCloseEdit = () => {
    setShowEdit(false);
    setSelectedMenu(null);
  };

  const [showAddProductModal, setShowAddProductModal] = useState(false);

  const handleShowAddProductModal = () => setShowAddProductModal(true);
  const handleCloseAddProductModal = () => setShowAddProductModal(false);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const menuRef = doc(db, "menu", id);
        const menuDoc = await getDoc(menuRef);
        if (menuDoc.exists()) {
          setMenu(menuDoc.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Errore durante il recupero del fornitore:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [
    id,
    showEdit,
    showDelete,
    showDeleteModal,
    showEditModal,
    showAddProductModal,
  ]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" role="status" variant="dark"></Spinner>
      </div>
    );
  }
  return menu ? (
    <>
      <Navbar />
      <div className=" d-flex flex-column align-items-center justify-content-center  mt-5">
        <Card className="login-card mb-4">
          <Card.Body className="p-0 py-4">
            <div className="d-flex flex-column justify-content-center align-items-center">
              <div className="d-flex justify-content-center align-items-center pb-4 mb-4 w-100 border-bottom border-3 border-primary">
                <Truck className="col-4"></Truck>
                <Card.Title className=" col-8 fs-3 m-0">
                  Menù: {menu.name}
                </Card.Title>
              </div>
              <div className="d-flex flex-column justify-content-center align-items-center w-100">
                <div className="border-bottom border-3 border-dark w-100 mb-4">
                  <div className="d-flex justify-content-center align-items-center pb-4">
                    <Person className="col-2"></Person>
                    <p className="col-6 m-0 ">{menu.createdBy}</p>
                    {/* <p>Telefono: {supplier.phoneNumber}</p> */}
                    <p className=" col-4 mb-0">
                      Prodotti: {menu.products ? menu.products.length : 0}
                    </p>
                  </div>
                  <div className="d-flex justify-content-center align-items-center">
                    <div className="col-6 border-end  py-2">
                      <div
                        className="d-flex justify-content-center align-items-center "
                        onClick={() => handleShowEdit(menu)}
                      >
                        <Pencil className="col-4 text-warning"></Pencil>
                        <p className="m-0 col-8 text-warning">Modifica</p>
                      </div>
                    </div>
                    <div className="col-6 py-2">
                      <div
                        className="d-flex justify-content-center align-items-center "
                        onClick={() => handleShowDelete(menu)}
                      >
                        <Trash className="col-4 text-danger"></Trash>
                        <p className="m-0 col-8 text-danger">Elimina</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
        <Card className="cardProdotti">
          <Card.Body className="px-2 py-4">
            <div className="d-flex flex-column justify-content-center align-items-center">
              <div className="d-flex row justify-content-center align-items-center pb-4 mb-4 w-100 border-bottom border-3 border-primary">
                <div className="col-12 d-flex justify-content-center align-items-center mb-3">
                  <Truck className="col-2"></Truck>
                  <Card.Title className=" col-10 fs-3 m-0">
                    Prodotti di: {menu.name}
                  </Card.Title>
                </div>
                <div className="col-12 d-flex justify-content-center align-items-center">
                  <Plus className="col-2"></Plus>

                  <p
                    className=" col-10 mb-0"
                    onClick={handleShowAddProductModal}
                  >
                    Aggiungi Prodotto
                  </p>
                </div>
                <AddMenuProductModal
                  show={showAddProductModal}
                  onHide={handleCloseAddProductModal}
                  menuSelec={id}
                />
              </div>
              {menu.products && menu.products.length > 0 ? (
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th className="text-center">#</th>
                      <th className="text-center">Nome</th>
                      <th className="text-center">Prezzo</th>
                      <th className="text-center">Categoria</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menu.products.map((menu, index) => (
                      <tr key={index}>
                        <td className="align-middle">
                          <div className="text-center d-flex justify-content-around align-items-center ">
                            <div className="border-end pe-2">{index + 1}</div>
                            <div className="d-flex flex-column justify-content-around align-items-center">
                              <div>
                                <Pencil
                                  className="text-warning "
                                  onClick={() => {
                                    handleShowEditModal(menu);
                                  }}
                                ></Pencil>
                              </div>
                              <div>
                                <Trash
                                  className="text-danger"
                                  onClick={() => {
                                    handleShowDeleteModal(menu);
                                  }}
                                ></Trash>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="align-middle">{menu.name}</td>
                        <td className="text-center align-middle">
                          {menu.price} €
                        </td>
                        <td className="text-center align-middle">
                          {menu.category}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <li>Nessun prodotto disponibile</li>
              )}
            </div>
          </Card.Body>
        </Card>

        {selectedMenu && (
          <>
            <ModalDeleteMenu
              id={id}
              show={showDelete}
              onHide={handleCloseDelete}
              menuName={selectedMenu.name}
            />
            <ModalEditMenu
              id={id}
              show={showEdit}
              onHide={handleCloseEdit}
              menudata={selectedMenu}
            />
          </>
        )}

        {selectedProduct && (
          <>
            <EditMenuProductModal
              show={showEditModal}
              onHide={handleCloseEditModal}
              product={selectedProduct}
              menuId={id}
            />
            <DeleteMenuProductModal
              show={showDeleteModal}
              onHide={handleCloseDeleteModal}
              productData={selectedProduct}
              menuId={id}
            />
          </>
        )}
      </div>
      <BackToTopButton />
    </>
  ) : null;
};
export default MenuDetail;
