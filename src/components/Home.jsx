import { Card } from "react-bootstrap";
import { List, Plus } from "react-bootstrap-icons";
import { NavLink } from "react-router-dom";
import AddProductModal from "./AddProductModal";
import { useState } from "react";

const Home = () => {
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  const handleShowAddProductModal = () => setShowAddProductModal(true);
  const handleCloseAddProductModal = () => setShowAddProductModal(false);
  return (
    <div className=" d-flex flex-column align-items-center justify-content-center  mt-5">
      <Card className="login-card mb-4">
        <Card.Body className="p-0 py-4">
          <div className="d-flex flex-column justify-content-center align-items-center">
            <div className="border-bottom border-3 border-primary w-100 mb-4">
              <Card.Title className="mb-4 fs-3 text-center">
                Fornitori
              </Card.Title>
            </div>
            <div className="w-100">
              <div className="d-flex justify-content-center align-items-center">
                <List className="col-4"></List>
                <NavLink to={"/listSupp"} className="col-8 nav-link">
                  Tutti i fornitori
                </NavLink>
              </div>
              <div className="d-flex justify-content-center align-items-center">
                <Plus className="col-4"></Plus>
                <NavLink to={"/addSupp"} className="col-8 nav-link ">
                  Aggiungi fornitore
                </NavLink>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
      <Card className="login-card mb-4">
        <Card.Body className="p-0 py-4">
          <div className="d-flex flex-column justify-content-center align-items-center mb-3">
            <div className="border-bottom border-3 border-primary w-100 mb-4">
              <Card.Title className="mb-4 fs-3 text-center">
                Prodotti
              </Card.Title>
            </div>
            <div className="w-100">
              <div className="d-flex justify-content-center align-items-center">
                <List className="col-4"></List>
                <NavLink to={"/listProd"} className="col-8 nav-link">
                  Tutti i prodotti
                </NavLink>
              </div>
              <div className="d-flex justify-content-center align-items-center">
                <Plus className="col-4"></Plus>
                <p
                  className=" col-8 nav-link mb-0"
                  onClick={handleShowAddProductModal}
                >
                  Aggiungi Prodotto
                </p>
              </div>
              <AddProductModal
                show={showAddProductModal}
                onHide={handleCloseAddProductModal}
              />
            </div>
          </div>
        </Card.Body>
      </Card>
      <Card className="login-card">
        <Card.Body className="p-0 py-4">
          <div className="d-flex flex-column justify-content-center align-items-center mb-3">
            <div className="border-bottom border-3 border-primary w-100 mb-4">
              <Card.Title className="mb-4 fs-3 text-center">Ordini</Card.Title>
            </div>
            <div className="w-100">
              <div className="d-flex justify-content-center align-items-center">
                <List className="col-4"></List>
                <NavLink to={"/listOrd"} className="col-8 nav-link">
                  Tutti gli ordini
                </NavLink>
              </div>
              <div className="d-flex justify-content-center align-items-center">
                <Plus className="col-4"></Plus>
                <NavLink to={"/addOrd"} className="col-8 nav-link ">
                  Aggiungi ordine
                </NavLink>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};
export default Home;
