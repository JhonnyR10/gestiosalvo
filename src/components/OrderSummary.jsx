import React from "react";
import { useLocation, useNavigate } from "react-router";
import { Card, Table, Button } from "react-bootstrap";

const OrderSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { supplierName, supplierPhoneNumber, products } = location.state;

  const handleSendOrder = () => {
    // Ottieni la data corrente nel formato "DD/MM/YYYY"
    const currentDate = new Date().toLocaleDateString("it-IT");

    // Mappa delle abbreviazioni per le unità di misura
    const unitAbbreviations = {
      Bottiglia: "BT",
      Cartone: "CR",
      Confezione: "CF",
      Pezzo: "PZ",
      Fusto: "FS",
      Flacone: "FL",
      Cassa: "CS",
      Tanica: "TN",
      Rotolo: "RL",
      Kilogrammo: "KG",
      Grammo: "GR",
      Litro: "LT",
    };

    // Costruisci il testo del messaggio dell'ordine
    const orderMessage =
      `ORDINE BLUEMARINE DEL ${currentDate} PER ${supplierName}:\n\n` +
      products
        .map(
          (product) =>
            `- ${product.quantity} ${
              unitAbbreviations[product.unitOfMeasure] || product.unitOfMeasure
            } ${product.name} `
        )
        .join("\n\n");

    // Costruisci l'URL per il messaggio di WhatsApp
    const whatsappUrl = `https://wa.me/${supplierPhoneNumber}?text=${encodeURIComponent(
      orderMessage
    )}`;

    // Apri il link su WhatsApp in una nuova finestra
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center mt-5">
      <Card className="mx-1">
        <Card.Body>
          <h3>Riepilogo Ordine per {supplierName}</h3>
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
              {products.map((product, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{product.name}</td>
                  <td>{product.quantity}</td>
                  <td>{product.unitOfMeasure}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button onClick={handleSendOrder}>Invia Ordine su WhatsApp</Button>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Modifica Ordine
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default OrderSummary;
