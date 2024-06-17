import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { Table, Card, Form } from "react-bootstrap";
import { Pencil } from "react-bootstrap-icons";
import { useNavigate } from "react-router";

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [showDrafts, setShowDrafts] = useState(false);
  const navigate = useNavigate();

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
  }, [selectedSupplier, showDrafts]);

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
    <div className="d-flex flex-column align-items-center justify-content-center mt-5 w-100">
      <Card className="mx-1">
        <Card.Body>
          <Card.Title>Elenco Ordini</Card.Title>
          <Form.Group controlId="formSupplierFilter">
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
          <Form.Group controlId="formDraftsFilter">
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
                <th>Stato</th>
                <th>Data</th>
                <th>Fornitore</th>
                <th>N. Prodotti</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    {order.isDraft ? (
                      <div>
                        <div className="border-bottom">Bozza</div>
                        <div className="text-center">
                          <Pencil
                            onClick={() => handleEditDraft(order)}
                          ></Pencil>
                        </div>
                      </div>
                    ) : (
                      "Inviato"
                    )}
                  </td>
                  <td>{order.createdAt.toDate().toLocaleString()}</td>
                  <td>{order.supplierName}</td>
                  <td>{order.products.length}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default OrdersList;
