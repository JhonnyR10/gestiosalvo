import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { Card, CardBody } from "react-bootstrap";
import { CardList, Eye, Pencil, Plus, Trash } from "react-bootstrap-icons";
import { NavLink, useNavigate } from "react-router-dom";
import ModalDeleteSupp from "./ModalDeleteSupp";
import ModalEditSupp from "./ModalEditSupp";
import Navbar from "./Navbar";
import BackToTopButton from "./BackToTopButton";
import SupplierPhoneNumber from "./SupplierPhoneNumber";
import { collection, getDocs } from "firebase/firestore";

const SupplierList = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const handleShowDelete = (supplier) => {
    setSelectedSupplier(supplier);
    setShowDelete(true);
  };

  const handleCloseDelete = () => {
    setShowDelete(false);
    setSelectedSupplier(null);
  };

  const handleShowEdit = (supplier) => {
    setSelectedSupplier(supplier);
    setShowEdit(true);
  };

  const handleCloseEdit = () => {
    setShowEdit(false);
    setSelectedSupplier(null);
  };

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "fornitori"));
        const suppliersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSuppliers(suppliersData);
      } catch (error) {
        console.error("Errore durante il recupero dei fornitori:", error);
      }
    };

    fetchSuppliers();
  }, [showDelete, showEdit]);

  return (
    <>
      <Navbar />
      <div className=" d-flex flex-column align-items-center justify-content-center  mt-5">
        <Card className="login-card mb-4">
          <Card.Body className="p-0 py-4">
            <div className="d-flex flex-column justify-content-center align-items-center">
              <div className="border-bottom border-3 border-primary w-100 mb-4">
                <div className="mb-3 d-flex justify-content-center align-items-center">
                  <CardList></CardList>
                  <Card.Title className="fs-3 mb-0 text-center ms-2">
                    Elenco fornitori
                  </Card.Title>
                </div>
              </div>
              <div className="d-flex justify-content-center align-items-center pb-3 w-100">
                <Plus className="col-2"></Plus>
                <NavLink to={"/addSupp"} className="col-6 nav-link ">
                  Aggiungi fornitore
                </NavLink>
                <p className=" col-4 mb-0">Totale: {suppliers.length}</p>
              </div>
            </div>
          </Card.Body>
        </Card>
        {suppliers.length > 0 ? (
          <div className="container text-center">
            <div className="row row-cols-1 g-2">
              {suppliers.map((supplier, index) => (
                <Card key={index} className="col">
                  <CardBody className="">
                    <div className="d-flex justify-content-between align-items-center pb-2">
                      <Card.Title
                        className=" m-0"
                        onClick={() => navigate(`/listSupp/${supplier.id}`)}
                      >
                        {supplier.name}
                      </Card.Title>
                      <Eye
                        className=""
                        onClick={() => navigate(`/listSupp/${supplier.id}`)}
                      ></Eye>
                    </div>
                    <div className="d-flex justify-content-between align-items-center pb-2">
                      <p className="mb-0">
                        Prodotti:{" "}
                        {supplier.products ? supplier.products.length : 0}
                      </p>
                      <Pencil
                        className="text-warning"
                        onClick={() => handleShowEdit(supplier)}
                      ></Pencil>
                    </div>
                    <div className="d-flex justify-content-between align-items-center pb-2">
                      {/* <p className="mb-0">
                        Cell: {supplier.phoneNumber ? supplier.phoneNumber : 0}
                      </p> */}
                      <SupplierPhoneNumber phoneNumber={supplier.phoneNumber} />
                      <Trash
                        className="text-danger"
                        onClick={() => handleShowDelete(supplier)}
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

        {selectedSupplier && (
          <>
            <ModalDeleteSupp
              id={selectedSupplier.id}
              show={showDelete}
              onHide={handleCloseDelete}
              suppName={selectedSupplier.name}
            />
            <ModalEditSupp
              id={selectedSupplier.id}
              show={showEdit}
              onHide={handleCloseEdit}
              supp={selectedSupplier}
            />
          </>
        )}
      </div>
      <BackToTopButton />
    </>
  );
};

export default SupplierList;
