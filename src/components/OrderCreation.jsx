import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { Form, Button, Card, Table, Modal } from "react-bootstrap";
import { useBlocker, useLocation, useNavigate } from "react-router-dom";

import Navbar from "./Navbar";

const OrderCreation = () => {
  const [showModal, setShowModal] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [products, setProducts] = useState([]);
  const [orderItems, setOrderItems] = useState({});
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [isSaving, setIsSaving] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      unsavedChanges && currentLocation.pathname !== nextLocation.pathname
  );

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

  useEffect(() => {
    if (location.state && location.state.orderData) {
      const { orderId, supplierId, products, orderItems } =
        location.state.orderData;
      setCurrentOrderId(orderId);
      setSelectedSupplier(supplierId);
      setProducts(products);
      setOrderItems(orderItems);
      console.log("useEffect", orderId);
    }
  }, [location.state]);

  const handleSupplierChange = (event) => {
    setSelectedSupplier(event.target.value);
    setOrderItems({});
    setUnsavedChanges(true);
  };

  const handleProductChange = (productId, key, value) => {
    setOrderItems((prevItems) => ({
      ...prevItems,
      [productId]: {
        ...prevItems[productId],
        [key]: value,
      },
    }));
    setUnsavedChanges(true);
  };

  const saveOrder = async (isDraft, isSending) => {
    setIsSaving(true);
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

        const orderData = {
          supplierId: selectedSupplier,
          supplierName: supplierData.name,
          supplierPhoneNumber: supplierData.phoneNumber,
          products: selectedProducts.map((product) => ({
            ...product,
            quantity: orderItems[product.id].quantity,
            unitOfMeasure:
              orderItems[product.id].unitOfMeasure || product.unitOfMeasure,
          })),
          isDraft,
        };

        if (!currentOrderId) {
          orderData.createdAt = new Date();
        }

        if (currentOrderId) {
          console.log("sono nel update", currentOrderId);
          // Update the existing order
          await db.collection("ordini").doc(currentOrderId).update(orderData);
          if (isSending) {
            navigate(`/order-summary/${currentOrderId}`);
          } else {
            navigate("/listOrd");
            console.log("Bozza aggiornata");
          }
        } else {
          console.log("sono nella creazione", currentOrderId);
          // Create a new order
          const docRef = await db.collection("ordini").add(orderData);
          const orderId = docRef.id;

          if (isSending) {
            navigate(`/order-summary/${orderId}`);
            // navigate("/order-summary", {
            //   state: {
            //     orderData: {
            //       ...orderData,
            //       orderId: orderId, // Aggiungi l'ID dell'ordine appena creato
            //     },
            //   },
            // });
          } else {
            navigate("/listOrd");
            console.log("Ordine salvato come bozza");
          }
        }
        setUnsavedChanges(false);
      }
    } catch (error) {
      console.error("Errore durante la creazione dell'ordine:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateOrder = () => {
    setUnsavedChanges(false);
    saveOrder(true, true);
  };

  const handleSaveAsDraft = () => {
    setUnsavedChanges(false);
    saveOrder(true, false);
  };

  const handleConfirmClose = () => {
    console.log("Navigation confirmed");
    setShowModal(false);
    blocker.proceed();
    // Esegui azioni per confermare la chiusura
  };

  const handleCancelClose = () => {
    console.log("Modal closed");
    setShowModal(false);
    blocker.reset();
    // Esegui azioni per annullare la chiusura
  };

  return (
    <>
      <Navbar />
      <div className="d-flex flex-column align-items-center justify-content-center mt-5">
        <Card className="login-card mb-4 w-75">
          <Card.Body>
            <Form.Group controlId="formSupplierSelect">
              <Form.Label>Seleziona Fornitore</Form.Label>
              <Form.Control
                as="select"
                value={selectedSupplier}
                onChange={handleSupplierChange}
                required
              >
                <option value="">Seleziona un fornitore</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Check
              type="checkbox"
              label="Visualizza solo i prodotti selezionati"
              checked={showSelectedOnly}
              onChange={(e) => setShowSelectedOnly(e.target.checked)}
            />
          </Card.Body>
        </Card>
        {selectedSupplier && (
          <Card className="mx-1">
            <Card.Body>
              <Table striped bordered hover responsive size="sm">
                <thead>
                  <tr>
                    <th className="align-middle">#</th>
                    <th className="align-middle">Nome</th>
                    <th className="small-column align-middle">Quantità</th>
                    <th className="align-middle">Unità di Misura</th>
                  </tr>
                </thead>
                <tbody>
                  {products
                    .filter((product) =>
                      showSelectedOnly
                        ? orderItems[product.id]?.quantity > 0
                        : true
                    )
                    .map((product, index) => (
                      <tr key={product.id}>
                        <td>{index + 1}</td>
                        <td>{product.name}</td>
                        <td className="align-middle">
                          <Form.Control
                            size="sm"
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
                        <td className="align-middle">
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
                            <option value="">{product.unitOfMeasure}</option>
                            <option value="Bottiglia">Bottiglia</option>
                            <option value="Cartone">Cartone</option>
                            <option value="Confezione">Confezione</option>
                            <option value="Pezzo">Pezzo</option>
                            <option value="Fusto">Fusto</option>
                            <option value="Flacone">Flacone</option>
                            <option value="Cassa">Cassa</option>
                            <option value="Tanica">Tanica</option>
                            <option value="Rotolo">Rotolo</option>
                            <option value="Kilogrammo">Kilogrammo</option>
                            <option value="Grammo">Grammo</option>
                            <option value="Litro">Litro</option>
                          </Form.Control>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
              <Button onClick={handleCreateOrder}>Crea Ordine</Button>
              <Button onClick={handleSaveAsDraft} className="ml-2">
                Salva come Bozza
              </Button>
            </Card.Body>
          </Card>
        )}
        <Modal
          show={blocker.state === "blocked"}
          onHide={handleCancelClose}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Conferma</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Ci sono modifiche non salvate. Sei sicuro di voler abbandonare la
            pagina?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCancelClose}>
              Annulla
            </Button>
            <Button variant="primary" onClick={handleConfirmClose}>
              Conferma
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default OrderCreation;
