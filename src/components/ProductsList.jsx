import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { Table, Form, Card } from "react-bootstrap";
import { Plus, Truck } from "react-bootstrap-icons";
import AddProductModal from "./AddProductModal";

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  const handleShowAddProductModal = () => setShowAddProductModal(true);
  const handleCloseAddProductModal = () => setShowAddProductModal(false);

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
  }, [showAddProductModal]);

  const handleSupplierChange = (event) => {
    setSelectedSupplier(event.target.value);
  };

  const filteredProducts = selectedSupplier
    ? products.filter((product) => product.supplierId === selectedSupplier)
    : products;

  return (
    <div className="d-flex flex-column align-items-center justify-content-center mt-5">
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
      <Card className="login-card w-75">
        <Card.Body>
          <div className="d-flex justify-content-center align-items-center pb-4 mb-4 w-100 border-bottom border-3 border-primary">
            <Plus className="col-3"></Plus>
            <p
              className=" col-9 nav-link mb-0"
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
                <th>#</th>
                <th>Nome</th>
                <th>Unità</th>
                <th>Fornitore</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <tr key={product.id}>
                    <td>{index + 1}</td>
                    <td>{product.name}</td>
                    <td>{product.unitOfMeasure}</td>
                    <td>
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
    </div>
  );
};

export default ProductsList;
