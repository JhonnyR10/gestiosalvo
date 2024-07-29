import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { Form, Button, Card, Table, Modal } from "react-bootstrap";
import { useBlocker, useLocation, useNavigate } from "react-router-dom";
import BackToTopButton from "./BackToTopButton";
import Navbar from "./Navbar";
import { CardList } from "react-bootstrap-icons";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

const OrderCreation = () => {
  // eslint-disable-next-line no-unused-vars
  const [showModal, setShowModal] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [products, setProducts] = useState([]);
  const [orderItems, setOrderItems] = useState({});
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  // eslint-disable-next-line no-unused-vars
  const [isSaving, setIsSaving] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      unsavedChanges && currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const suppliersSnapshot = await getDocs(collection(db, "fornitori"));
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
          const supplierDoc = await getDoc(
            doc(db, "fornitori", selectedSupplier)
          );
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
      const supplierDoc = await getDoc(doc(db, "fornitori", selectedSupplier));
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
          await updateDoc(doc(db, "ordini", currentOrderId), orderData);
          if (isSending) {
            navigate(`/order-summary/${currentOrderId}`);
          } else {
            navigate("/listOrd");
            console.log("Bozza aggiornata");
          }
        } else {
          console.log("sono nella creazione", currentOrderId);
          // Create a new order
          const docRef = await addDoc(collection(db, "ordini"), orderData);
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
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (showSelectedOnly ? orderItems[product.id]?.quantity > 0 : true)
  );

  return (
    <>
      <Navbar />
      <div className="d-flex flex-column align-items-center justify-content-center mt-5">
        <Card className="login-card mb-4">
          <Card.Body>
            <div className="d-flex justify-content-center align-items-center pb-4 mb-4 w-100 border-bottom border-3 border-primary">
              <CardList className="col-3"></CardList>
              <Card.Title className=" col-9 fs-3 m-0">
                Aggiungi Ordine
              </Card.Title>
            </div>
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
            {selectedSupplier && (
              <Form.Group className="mt-2" controlId="formProductSearch">
                <Form.Label>Ricerca Prodotto</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Cerca per nome"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Form.Group>
            )}
            <Form.Check
              className="mt-3 formCheckordini"
              type="checkbox"
              label="Visualizza solo i prodotti selezionati"
              checked={showSelectedOnly}
              onChange={(e) => setShowSelectedOnly(e.target.checked)}
            />
          </Card.Body>
        </Card>
        {selectedSupplier && (
          <Card className="cardProdotti">
            <Card.Body className="px-2">
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
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product, index) => (
                      <tr key={product.id}>
                        <td className="align-middle text-center">
                          {index + 1}
                        </td>
                        <td className="">{product.name}</td>
                        <td className="align-middle">
                          <Form.Control
                            className="text-center small-column "
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
                        <td className="align-middle ">
                          <Form.Control
                            className=" text-center truncated-text "
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
                            <option value="BT">Bottiglia</option>
                            <option value="CT">Cartone</option>
                            <option value="CF">Confezione</option>
                            <option value="PZ">Pezzo</option>
                            <option value="FS">Fusto</option>
                            <option value="FL">Flacone</option>
                            <option value="CS">Cassa</option>
                            <option value="TN">Tanica</option>
                            <option value="RT">Rotolo</option>
                            <option value="KG">Kilogrammo</option>
                            <option value="GR">Grammo</option>
                            <option value="LT">Litro</option>
                          </Form.Control>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        Nessun prodotto trovato.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
              <div
                className="d-flex justify-content-end py-2"
                style={{
                  position: "sticky",
                  bottom: 0,
                  backgroundColor: "white",
                }}
              >
                <Button
                  onClick={handleSaveAsDraft}
                  variant="secondary"
                  className="me-2"
                >
                  Salva come Bozza
                </Button>
                <Button variant="success" onClick={handleCreateOrder}>
                  Crea Ordine
                </Button>
              </div>
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
      {/* <BackToTopButton /> */}
    </>
  );
};

export default OrderCreation;
