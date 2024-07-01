import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { Table, Form, Card } from "react-bootstrap";
import { Pencil, Plus, Trash, Truck } from "react-bootstrap-icons";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";
import DeleteProductModal from "./DeleteProductModal";
import Navbar from "./Navbar";
import BackToTopButton from "./BackToTopButton";

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  const handleShowAddProductModal = () => setShowAddProductModal(true);
  const handleCloseAddProductModal = () => setShowAddProductModal(false);

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsSnapshot = await db.collection("prodotti").get();
        const productsList = productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsList);
      } catch (error) {
        console.error("Errore durante il recupero dei prodotti:", error);
      }
    };

    const fetchSuppliers = async () => {
      try {
        const suppliersSnapshot = await db.collection("fornitori").get();
        const suppliersList = suppliersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSuppliers(suppliersList);
      } catch (error) {
        console.error("Errore durante il recupero dei fornitori:", error);
      }
    };

    fetchProducts();
    fetchSuppliers();
  }, [showAddProductModal, showDeleteModal, showEditModal]);

  const handleSupplierChange = (event) => {
    setSelectedSupplier(event.target.value);
  };
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const filteredProducts = products.filter(
    (product) =>
      (selectedSupplier ? product.supplierId === selectedSupplier : true) &&
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="d-flex flex-column align-items-center justify-content-center mt-5 w-100">
        <Card className="login-card mb-4">
          <Card.Body>
            <div className="d-flex justify-content-center align-items-center pb-4 mb-4 w-100 border-bottom border-3 border-primary">
              <Truck className="col-4"></Truck>
              <Card.Title className=" col-8 fs-3 m-0">Prodotti</Card.Title>
            </div>
            <Form.Group controlId="formSupplierSelect">
              <Form.Label>Seleziona Fornitore</Form.Label>
              <Form.Control
                as="select"
                value={selectedSupplier}
                onChange={handleSupplierChange}
              >
                <option value="">Tutti i fornitori</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formSearch" className="mt-2">
              <Form.Label>Cerca per Nome</Form.Label>
              <Form.Control
                type="text"
                placeholder="Cerca prodotto"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </Form.Group>
          </Card.Body>
        </Card>
        <Card className=" cardProdotti">
          <Card.Body className="px-2">
            <div className="d-flex justify-content-center align-items-center pb-4 mb-4 border-bottom border-3 border-primary">
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
            <Table striped bordered hover responsive size="sm">
              <thead>
                <tr>
                  <th className="text-center">#</th>
                  <th className="text-center">Nome</th>
                  <th className="text-center">Unità</th>
                  <th className="text-center">Fornitore</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product, index) => (
                    <tr key={product.id}>
                      <td className="align-middle">
                        <div className="text-center d-flex justify-content-around align-items-center ">
                          <div className="border-end pe-2">{index + 1}</div>
                          <div className="d-flex flex-column justify-content-around align-items-center">
                            <div>
                              <Pencil
                                className="text-warning "
                                onClick={() => {
                                  handleShowEditModal(product);
                                }}
                              ></Pencil>
                            </div>
                            <div>
                              <Trash
                                className="text-danger"
                                onClick={() => {
                                  handleShowDeleteModal(product);
                                }}
                              ></Trash>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="align-middle">{product.name}</td>
                      <td className="text-center align-middle">
                        {product.unitOfMeasure}
                      </td>
                      <td className="text-center align-middle">
                        {
                          suppliers.find(
                            (supplier) => supplier.id === product.supplierId
                          )?.name
                        }
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      Nessun prodotto disponibile
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
        {selectedProduct && (
          <>
            <EditProductModal
              show={showEditModal}
              onHide={handleCloseEditModal}
              product={selectedProduct}
              supplierId={selectedProduct.supplierId}
            />
            <DeleteProductModal
              show={showDeleteModal}
              onHide={handleCloseDeleteModal}
              productId={selectedProduct.id}
              supplierId={selectedProduct.supplierId}
            />
          </>
        )}
      </div>
      <BackToTopButton />
    </>
  );
};

export default ProductsList;
