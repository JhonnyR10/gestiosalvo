import { Card, CardBody } from "react-bootstrap";
import Navbar from "./Navbar";
import { CardList, Eye, Pencil, Plus, Trash } from "react-bootstrap-icons";
import BackToTopButton from "./BackToTopButton";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useNavigate } from "react-router";
import AddMenuProductModal from "./AddMenuProductModal";
import ModalEditMenu from "./ModalEditMenu";
import ModalDeleteMenu from "./ModalDeleteMenu";

const MenuList = () => {
  const [menu, setMenu] = useState([]);
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const handleShowAddProductModal = () => setShowAddProductModal(true);
  const handleCloseAddProductModal = () => setShowAddProductModal(false);

  const handleShowEdit = (menu) => {
    setSelectedMenu(menu);
    setShowEdit(true);
  };

  const handleCloseEdit = () => {
    setShowEdit(false);
    setSelectedMenu(null);
  };

  const handleShowDelete = (menu) => {
    setSelectedMenu(menu);
    setShowDelete(true);
  };

  const handleCloseDelete = () => {
    setShowDelete(false);
    setSelectedMenu(null);
  };

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const menuSnapshot = await getDocs(collection(db, "menu"));
        const menuList = menuSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMenu(menuList);
      } catch (error) {
        console.log("Errore durante il recupero dei prodotti:", error);
      }
    };
    fetchMenu();
  }, [showAddProductModal, showEdit, showDelete]);

  return (
    <>
      <Navbar />
      <div className="d-flex flex-column align-items-center justify-content-center mt-5 w-100">
        <Card className="login-card mb-4">
          <Card.Body className="p-0 py-4">
            <div className="d-flex flex-column justify-content-center align-items-center">
              <div className="border-bottom border-3 border-primary w-100 mb-4">
                <div className="mb-3 d-flex justify-content-center align-items-center">
                  <CardList></CardList>
                  <Card.Title className="fs-3 mb-0 text-center ms-2">
                    Elenco Menu
                  </Card.Title>
                </div>
              </div>
              <div className="d-flex justify-content-center align-items-center pb-3 w-100">
                <Plus className="col-2"></Plus>
                <p
                  className=" col-6 nav-link mb-0"
                  onClick={handleShowAddProductModal}
                >
                  Aggiungi Prodotto al Menù
                </p>
                <p className=" col-4 mb-0">Totale: {menu.length}</p>
              </div>
              <AddMenuProductModal
                show={showAddProductModal}
                onHide={handleCloseAddProductModal}
              />
            </div>
          </Card.Body>
        </Card>
        {menu.length > 0 ? (
          <div className="container text-center">
            <div className="row row-cols-1 g-2">
              {menu.map((menu, index) => (
                <Card key={index} className="col">
                  <CardBody className="">
                    <div className="d-flex justify-content-between align-items-center pb-2">
                      <Card.Title
                        className=" m-0"
                        onClick={() => navigate(`/menuList/${menu.id}`)}
                      >
                        {menu.name}
                      </Card.Title>
                      <Eye
                        className=""
                        onClick={() => navigate(`/menuList/${menu.id}`)}
                      ></Eye>
                    </div>
                    <div className="d-flex justify-content-between align-items-center pb-2">
                      <p className="mb-0">
                        Prodotti: {menu.products ? menu.products.length : 0}
                      </p>
                      <Pencil
                        className="text-warning"
                        onClick={() => handleShowEdit(menu)}
                      ></Pencil>
                    </div>
                    <div className="d-flex justify-content-between align-items-center pb-2">
                      {/* <p className="mb-0">
                        Cell: {menu.phoneNumber ? menu.phoneNumber : 0}
                      </p> */}
                      <p className="m-0">Creato da: {menu.createdBy}</p>
                      <Trash
                        className="text-danger"
                        onClick={() => handleShowDelete(menu)}
                      ></Trash>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <p>Nessun fornitore trovato.</p>
        )}

        {selectedMenu && (
          <>
            <ModalDeleteMenu
              id={selectedMenu.id}
              show={showDelete}
              onHide={handleCloseDelete}
              menuName={selectedMenu.name}
            />
            <ModalEditMenu
              id={selectedMenu.id}
              show={showEdit}
              onHide={handleCloseEdit}
              menudata={selectedMenu}
            />
          </>
        )}
      </div>
      <BackToTopButton />
    </>
  );
};
export default MenuList;
