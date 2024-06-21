import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { Table, Form, Card } from "react-bootstrap";
import { Pencil, Plus, Trash, Truck } from "react-bootstrap-icons";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";
import DeleteProductModal from "./DeleteProductModal";
import Navbar from "./Navbar";

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
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

  const filteredProducts = selectedSupplier
    ? products.filter((product) => product.supplierId === selectedSupplier)
    : products;

  return (
    <>
      <Navbar />
      <div className="d-flex flex-column align-items-center justify-content-center mt-5 w-100">
        <Card className="login-card mb-4 w-75">
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
          </Card.Body>
        </Card>
        <Card className="mx-2">
          <Card.Body className="px-1">
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
                      <td className="text-center align-middle">
                        <div className="border-bottom pb-1">{index + 1}</div>
                        <div className="d-flex justify-content-around align-items-center mt-1">
                          <div>
                            <Pencil
                              className="text-warning me-2"
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
                      </td>
                      <td>
                        <div className="">{product.name}</div>
                      </td>
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
    </>
  );
};

export default ProductsList;
