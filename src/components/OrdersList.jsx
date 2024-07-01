import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { Table, Card, Form } from "react-bootstrap";
import { CardList, Eye, Pencil, Trash } from "react-bootstrap-icons";
import { useNavigate } from "react-router";
import Navbar from "./Navbar";
import DeleteOrderModal from "./DeleteOrderModal";
import BackToTopButton from "./BackToTopButton";

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [showDrafts, setShowDrafts] = useState(false);
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleShowDeleteModal = (order) => {
    setSelectedOrder(order);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedOrder(null);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        let ordersQuery = db.collection("ordini").orderBy("createdAt", "desc");

        if (selectedSupplier) {
          ordersQuery = ordersQuery.where("supplierId", "==", selectedSupplier);
        }

        if (!showDrafts) {
          ordersQuery = ordersQuery.where("isDraft", "==", false);
        }

        const ordersSnapshot = await ordersQuery.get();
        const ordersList = ordersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(ordersList);
        setFilteredOrders(ordersList);
      } catch (error) {
        console.error("Errore durante il recupero degli ordini:", error);
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

    fetchOrders();
    fetchSuppliers();
  }, [selectedSupplier, showDrafts, showDeleteModal]);

  const handleEditDraft = (order) => {
    navigate("/addOrd", {
      state: {
        orderData: {
          orderId: order.id,
          supplierId: order.supplierId,
          products: order.products,
          orderItems: order.products.reduce((items, product) => {
            items[product.id] = {
              quantity: product.quantity,
              unitOfMeasure: product.unitOfMeasure,
            };
            return items;
          }, {}),
        },
      },
    });
  };
  const handleSupplierChange = (event) => {
    const supplierId = event.target.value;
    setSelectedSupplier(supplierId);
  };

  const handleDraftsChange = (event) => {
    const showDrafts = event.target.checked;
    setShowDrafts(showDrafts);
  };

  return (
    <>
      <Navbar />
      <div className="d-flex flex-column align-items-center justify-content-center mt-5 w-100">
        <Card className="mx-1">
          <Card.Body>
            <div className="d-flex justify-content-center align-items-center pb-4 mb-4 w-100 border-bottom border-3 border-primary">
              <CardList className="col-4"></CardList>
              <Card.Title className=" col-8 fs-3 m-0">Elenco Ordini</Card.Title>
            </div>
            <Form.Group controlId="formSupplierFilter" className="mb-3">
              <Form.Label>Filtra per Fornitore</Form.Label>
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
            <Form.Group className="mb-3" controlId="formDraftsFilter">
              <Form.Check
                type="checkbox"
                label="Mostra bozze"
                checked={showDrafts}
                onChange={handleDraftsChange}
              />
            </Form.Group>
            <Table striped bordered hover responsive size="sm">
              <thead>
                <tr>
                  <th className="align-middle">Stato</th>
                  <th className="align-middle">Data</th>
                  <th className="align-middle">Fornitore</th>
                  <th className="align-middle">N. Prodotti</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      {order.isDraft ? (
                        <div>
                          <div className="border-bottom">Bozza</div>
                          <div className="d-flex justify-content-around align-items-center mt-1">
                            <Pencil
                              className="text-warning"
                              onClick={() => handleEditDraft(order)}
                            ></Pencil>

                            <Trash
                              className="text-danger"
                              onClick={() => {
                                handleShowDeleteModal(order);
                              }}
                            ></Trash>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="border-bottom">Inviato</div>
                          <div className="d-flex justify-content-around align-items-center mt-1">
                            <Eye
                              onClick={() =>
                                navigate(`/order-summary/${order.id}`)
                              }
                            ></Eye>

                            <Trash
                              className="text-danger"
                              onClick={() => {
                                handleShowDeleteModal(order);
                              }}
                            ></Trash>
                          </div>
                        </div>
                      )}
                    </td>
                    <td>{order.createdAt.toDate().toLocaleString()}</td>
                    <td className="align-middle text-center">
                      {order.supplierName}
                    </td>
                    <td className="align-middle text-center">
                      {order.products.length}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
        {selectedOrder && (
          <>
            <DeleteOrderModal
              show={showDeleteModal}
              onHide={handleCloseDeleteModal}
              orderId={selectedOrder.id}
            />
          </>
        )}
      </div>
      <BackToTopButton />
    </>
  );
};

export default OrdersList;
