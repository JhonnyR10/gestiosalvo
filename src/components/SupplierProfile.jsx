import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { db } from "../firebaseConfig";
import { Card, Table } from "react-bootstrap";
import ModalDeleteSupp from "./ModalDeleteSupp";
import ModalEditSupp from "./ModalEditSupp";
import { Pencil, Phone, Plus, Trash, Truck } from "react-bootstrap-icons";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";
import DeleteProductModal from "./DeleteProductModal";
import Navbar from "./Navbar";
import BackToTopButton from "./BackToTopButton";
import { doc, getDoc } from "firebase/firestore";

const SupplierProfile = () => {
  const { id } = useParams();

  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
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

  const [showAddProductModal, setShowAddProductModal] = useState(false);

  const handleShowAddProductModal = () => setShowAddProductModal(true);
  const handleCloseAddProductModal = () => setShowAddProductModal(false);

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const supplierRef = doc(db, "fornitori", id);
        const supplierDoc = await getDoc(supplierRef);
        if (supplierDoc.exists()) {
          setSupplier(supplierDoc.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Errore durante il recupero del fornitore:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSupplier();
  }, [
    id,
    showEdit,
    showDelete,
    showDeleteModal,
    showEditModal,
    showAddProductModal,
  ]);

  if (loading) {
    return <p>Caricamento...</p>;
  }
  return supplier ? (
    <>
      <Navbar />
      <div className=" d-flex flex-column align-items-center justify-content-center  mt-5">
        <Card className="login-card mb-4">
          <Card.Body className="p-0 py-4">
            <div className="d-flex flex-column justify-content-center align-items-center">
              <div className="d-flex justify-content-center align-items-center pb-4 mb-4 w-100 border-bottom border-3 border-primary">
                <Truck className="col-4"></Truck>
                <Card.Title className=" col-8 fs-3 m-0">
                  {supplier.name}
                </Card.Title>
              </div>
              <div className="d-flex flex-column justify-content-center align-items-center w-100">
                <div className="border-bottom border-3 border-dark w-100 mb-4">
                  <div className="d-flex justify-content-center align-items-center pb-4">
                    <Phone className="col-2"></Phone>
                    <p className="col-6 m-0 ">{supplier.phoneNumber}</p>
                    {/* <p>Telefono: {supplier.phoneNumber}</p> */}
                    <p className=" col-4 mb-0">
                      Prodotti:{" "}
                      {supplier.products ? supplier.products.length : 0}
                    </p>
                  </div>
                  <div className="d-flex justify-content-center align-items-center">
                    <div className="col-6 border-end  py-2">
                      <div
                        className="d-flex justify-content-center align-items-center "
                        onClick={() => handleShowEdit(supplier)}
                      >
                        <Pencil className="col-4 text-warning"></Pencil>
                        <p className="m-0 col-8 text-warning">Modifica</p>
                      </div>
                    </div>
                    <div className="col-6 py-2">
                      <div
                        className="d-flex justify-content-center align-items-center "
                        onClick={() => handleShowDelete(supplier)}
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
                    Prodotti di: {supplier.name}
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
                <AddProductModal
                  show={showAddProductModal}
                  onHide={handleCloseAddProductModal}
                />
              </div>
              {supplier.products && supplier.products.length > 0 ? (
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Nome</th>
                      <th className="text-center">Unità</th>
                      <th className="text-center">Edit</th>
                      <th className="text-center">Elimina</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supplier.products.map((product, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{product.name}</td>
                        <td className="text-center">{product.unitOfMeasure}</td>
                        <td className="text-center text-warning">
                          <Pencil
                            onClick={() => {
                              handleShowEditModal(product);
                            }}
                          ></Pencil>
                        </td>
                        <td className="text-center text-danger">
                          <Trash
                            onClick={() => {
                              handleShowDeleteModal(product);
                            }}
                          ></Trash>
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

        {selectedSupplier && (
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
        )}
      </div>
      <BackToTopButton />
    </>
  ) : null;
};

export default SupplierProfile;
