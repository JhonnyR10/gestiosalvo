import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Table, Button } from "react-bootstrap";
import Navbar from "./Navbar";
import { db } from "../firebaseConfig";

const OrderSummary = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();

  const [orderData, setOrderData] = useState(null);
  // const { supplierName, supplierPhoneNumber, products, orderId, isDraft } =
  //   orderData;

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderDoc = await db.collection("ordini").doc(orderId).get();
        if (orderDoc.exists) {
          setOrderData(orderDoc.data());
        } else {
          console.error("Ordine non trovato");
          navigate("/home"); // Naviga a una pagina di errore o alla home se l'ordine non esiste
        }
      } catch (error) {
        console.error("Errore durante il recupero dell'ordine:", error);
        // Gestisci l'errore di fetch
      }
    };

    fetchOrder();
  }, [orderId, navigate, orderData]);

  const handleSendOrder = () => {
    // Ottieni la data corrente nel formato "DD/MM/YYYY"
    const currentDate = new Date().toLocaleDateString("it-IT");

    // Mappa delle abbreviazioni per le unità di misura
    // const unitAbbreviations = {
    //   Bottiglia: "BT",
    //   Cartone: "CR",
    //   Confezione: "CF",
    //   Pezzo: "PZ",
    //   Fusto: "FS",
    //   Flacone: "FL",
    //   Cassa: "CS",
    //   Tanica: "TN",
    //   Rotolo: "RL",
    //   Kilogrammo: "KG",
    //   Grammo: "GR",
    //   Litro: "LT",
    // };

    // Costruisci il testo del messaggio dell'ordine
    const orderMessage =
      `${currentDate} ~ *BLUEMARINE* _x_ *${orderData.supplierName}*:\n\n` +
      orderData.products
        .map(
          (product) =>
            `- ${product.quantity} ${product.unitOfMeasure} ${product.name} `
        )
        .join("\n\n");

    // Costruisci l'URL per il messaggio di WhatsApp
    const whatsappUrl = `https://wa.me/${
      orderData.supplierPhoneNumber
    }?text=${encodeURIComponent(orderMessage)}`;

    // Apri il link su WhatsApp in una nuova finestra
    window.open(whatsappUrl, "_blank");

    if (orderId) {
      db.collection("ordini")
        .doc(orderId)
        .update({
          isDraft: false,
        })
        .then(() => {
          setOrderData({ ...orderData, isDraft: false });
        })
        .catch((error) => {
          console.error("Errore durante l'aggiornamento di isDirty:", error);
        });
    }
  };
  const handleEditDraft = (order) => {
    navigate("/addOrd", {
      state: {
        orderData: {
          orderId: orderId,
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
  return (
    <>
      <Navbar></Navbar>
      {orderData ? (
        <div className="d-flex flex-column align-items-center justify-content-center mt-5">
          <Card className="mx-1">
            <Card.Body>
              <h3>Riepilogo Ordine per {orderData.supplierName}</h3>
              <p>Id ordine: {orderId}</p>
              <p>Stato: {orderData.isDraft ? "Bozza" : "Inviato"}</p>
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nome</th>
                    <th>Quantità</th>
                    <th>Unità di Misura</th>
                  </tr>
                </thead>
                <tbody>
                  {orderData.products.map((product, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{product.name}</td>
                      <td>{product.quantity}</td>
                      <td>{product.unitOfMeasure}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Button onClick={handleSendOrder}>
                Invia Ordine su WhatsApp
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleEditDraft(orderData)}
              >
                Modifica Ordine
              </Button>
            </Card.Body>
          </Card>
        </div>
      ) : null}
    </>
  );
};

export default OrderSummary;
