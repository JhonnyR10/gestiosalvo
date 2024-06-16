import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { Form, Button, Card, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const OrderCreation = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [products, setProducts] = useState([]);
  const [orderItems, setOrderItems] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
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

    fetchSuppliers();
  }, []);

  useEffect(() => {
    if (selectedSupplier) {
      const fetchProducts = async () => {
        try {
          const supplierDoc = await db
            .collection("fornitori")
            .doc(selectedSupplier)
            .get();
          if (supplierDoc.exists) {
            setProducts(supplierDoc.data().products || []);
          }
        } catch (error) {
          console.error("Errore durante il recupero dei prodotti:", error);
        }
      };

      fetchProducts();
    }
  }, [selectedSupplier]);

  const handleSupplierChange = (event) => {
    setSelectedSupplier(event.target.value);
    setOrderItems({});
  };

  const handleProductChange = (productId, key, value) => {
    setOrderItems((prevItems) => ({
      ...prevItems,
      [productId]: {
        ...prevItems[productId],
        [key]: value,
      },
    }));
  };

  const handleCreateOrder = async () => {
    try {
      const supplierDoc = await db
        .collection("fornitori")
        .doc(selectedSupplier)
        .get();
      if (supplierDoc.exists) {
        const supplierData = supplierDoc.data();
        const selectedProducts = products.filter(
          (product) => orderItems[product.id] && orderItems[product.id].quantity
        );

        navigate("/order-summary", {
          state: {
            supplierName: supplierData.name,
            supplierPhoneNumber: supplierData.phoneNumber,
            products: selectedProducts.map((product) => ({
              ...product,
              quantity: orderItems[product.id].quantity,
              unitOfMeasure: orderItems[product.id].unitOfMeasure,
            })),
          },
        });
      }
    } catch (error) {
      console.error("Errore durante la creazione dell'ordine:", error);
    }
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center mt-5">
      <Card className="login-card mb-4 w-75">
        <Card.Body>
          <Form.Group controlId="formSupplierSelect">
            <Form.Label>Seleziona Fornitore</Form.Label>
            <Form.Control
              as="select"
              value={selectedSupplier}
              onChange={handleSupplierChange}
            >
              <option value="">Seleziona un fornitore</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Card.Body>
      </Card>
      {selectedSupplier && (
        <Card className="login-card mb-4 w-75">
          <Card.Body>
            <Table striped bordered hover responsive size="sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nome</th>
                  <th>Unità</th>
                  <th>Quantità</th>
                  <th>Unità di Misura</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={product.id}>
                    <td>{index + 1}</td>
                    <td>{product.name}</td>
                    <td>{product.unitOfMeasure}</td>
                    <td>
                      <Form.Control
                        type="number"
                        min="0"
                        value={orderItems[product.id]?.quantity || ""}
                        onChange={(e) =>
                          handleProductChange(
                            product.id,
                            "quantity",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td>
                      <Form.Control
                        as="select"
                        value={orderItems[product.id]?.unitOfMeasure || ""}
                        onChange={(e) =>
                          handleProductChange(
                            product.id,
                            "unitOfMeasure",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Seleziona</option>
                        <option value="bottiglia">Bottiglia</option>
                        <option value="cartone">Cartone</option>
                        <option value="confezione">Confezione</option>
                        <option value="pezzo">Pezzo</option>
                        <option value="fusto">Fusto</option>
                        <option value="flacone">Flacone</option>
                        <option value="cassa">Cassa</option>
                        <option value="tanica">Tanica</option>
                        <option value="rotolo">Rotolo</option>
                      </Form.Control>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Button onClick={handleCreateOrder}>Crea Ordine</Button>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default OrderCreation;
