import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { Card } from "react-bootstrap";
import { Eye, Pencil, Plus, Trash } from "react-bootstrap-icons";
import { NavLink, useNavigate } from "react-router-dom";
import ModalDeleteSupp from "./ModalDeleteSupp";
import ModalEditSupp from "./ModalEditSupp";

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
        const suppliersCollection = await db.collection("fornitori").get();
        const suppliersData = suppliersCollection.docs.map((doc) => ({
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
    <div className=" d-flex flex-column align-items-center justify-content-center  mt-5">
      <Card className="login-card mb-4">
        <Card.Body className="p-0 py-4">
          <div className="d-flex flex-column justify-content-center align-items-center">
            <div className="border-bottom border-3 border-primary w-100 mb-4">
              <Card.Title className="mb-4 fs-3 text-center">
                Elenco fornitori
              </Card.Title>
              <div className="d-flex justify-content-center align-items-center pb-4">
                <Plus className="col-2"></Plus>
                <NavLink to={"/addSupp"} className="col-6 nav-link ">
                  Aggiungi fornitore
                </NavLink>
                <p className=" col-4 mb-0">Totale: {suppliers.length}</p>
              </div>
            </div>
            {suppliers.length > 0 ? (
              <div className="d-flex flex-column justify-content-center align-items-center w-100">
                {suppliers.map((supplier, index) => (
                  <div
                    className="border-bottom border-3 border-dark w-100 mb-4"
                    key={index}
                  >
                    <div className="d-flex justify-content-center align-items-center pb-4">
                      <Eye className="col-2"></Eye>
                      <Card.Title
                        className="col-6 m-0"
                        onClick={() => navigate(`/listSupp/${supplier.id}`)}
                      >
                        {supplier.name}
                      </Card.Title>
                      {/* <p>Telefono: {supplier.phoneNumber}</p> */}
                      <p className=" col-4 mb-0">
                        Prodotti:{" "}
                        {supplier.products ? supplier.products.length : 0}
                      </p>
                    </div>
                    <div className="d-flex justify-content-center align-items-center">
                      <div className="col-6 border-end bg-danger py-2">
                        <div
                          className="d-flex justify-content-center align-items-center "
                          onClick={() => handleShowDelete(supplier)}
                        >
                          <Trash className="col-4 text-white"></Trash>
                          <p className="m-0 col-8 text-white">Elimina</p>
                        </div>
                      </div>
                      <div className="col-6 bg-warning py-2">
                        <div
                          className="d-flex justify-content-center align-items-center "
                          onClick={() => handleShowEdit(supplier)}
                        >
                          <Pencil className="col-4"></Pencil>
                          <p className="m-0 col-8">Modifica</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>Nessun fornitore trovato.</p>
            )}
          </div>
        </Card.Body>
      </Card>
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
  );
};

export default SupplierList;
