import { Card } from "react-bootstrap";
import { List, Plus } from "react-bootstrap-icons";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import Navbar from "./Navbar";
import logo from "../logoGestioSalvo2.png";
import AddMenuProductModal from "./AddMenuProductModal";
import AddAccountModal from "./AddAccountModal";

const HomeConti = () => {
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);

  const handleShowAddProductModal = () => setShowAddProductModal(true);
  const handleCloseAddProductModal = () => setShowAddProductModal(false);

  const handleShowAddAccounttModal = () => setShowAddAccountModal(true);
  const handleCloseAddAccountModal = () => setShowAddAccountModal(false);
  return (
    <>
      <Navbar />
      <div className=" d-flex flex-column align-items-center justify-content-center  mt-1">
        <img className="logo" src={logo} alt="logo"></img>
        <Card className="login-card mb-4">
          <Card.Body className="p-0 py-4">
            <div className="d-flex flex-column justify-content-center align-items-center mb-3">
              <div className="border-bottom border-3 border-primary w-100 mb-4">
                <Card.Title className="mb-4 fs-3 text-center">Menù</Card.Title>
              </div>
              <div className="w-100">
                <div className="d-flex justify-content-center align-items-center">
                  <List className="col-4"></List>
                  <NavLink to={"/menuList"} className="col-8 nav-link">
                    Visualizza il Menù
                  </NavLink>
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  <Plus className="col-4"></Plus>
                  <p
                    className=" col-8 nav-link mb-0"
                    onClick={handleShowAddProductModal}
                  >
                    Aggiungi Prodotto al Menù
                  </p>
                </div>
                <AddMenuProductModal
                  show={showAddProductModal}
                  onHide={handleCloseAddProductModal}
                />
              </div>
            </div>
          </Card.Body>
        </Card>
        <Card className="login-card mb-4">
          <Card.Body className="p-0 py-4">
            <div className="d-flex flex-column justify-content-center align-items-center mb-3">
              <div className="border-bottom border-3 border-primary w-100 mb-4">
                <Card.Title className="mb-4 fs-3 text-center">
                  Clienti
                </Card.Title>
              </div>
              <div className="w-100">
                <div className="d-flex justify-content-center align-items-center">
                  <List className="col-4"></List>
                  <NavLink to={"/clientsList"} className="col-8 nav-link">
                    Tutti i Clienti
                  </NavLink>
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  <Plus className="col-4"></Plus>
                  <p
                    className=" col-8 nav-link mb-0"
                    onClick={handleShowAddProductModal}
                  >
                    Aggiungi Cliente
                  </p>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
        <Card className="login-card">
          <Card.Body className="p-0 py-4">
            <div className="d-flex flex-column justify-content-center align-items-center mb-3">
              <div className="border-bottom border-3 border-primary w-100 mb-4">
                <Card.Title className="mb-4 fs-3 text-center">
                  Conti Cliente
                </Card.Title>
              </div>
              <div className="w-100">
                <div className="d-flex justify-content-center align-items-center">
                  <List className="col-4"></List>
                  <NavLink to={"/listOrd"} className="col-8 nav-link">
                    Tutti i Conti
                  </NavLink>
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  <Plus className="col-4"></Plus>
                  <p
                    className=" col-8 nav-link mb-0"
                    onClick={handleShowAddAccounttModal}
                  >
                    Aggiungi Conto Cliente
                  </p>
                </div>
                <AddAccountModal
                  show={showAddAccountModal}
                  onHide={handleCloseAddAccountModal}
                />
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </>
  );
};
export default HomeConti;
