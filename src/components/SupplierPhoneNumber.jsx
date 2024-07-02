import React, { useState } from "react";
import { Alert, Dropdown } from "react-bootstrap";
import ReactDOM from "react-dom";

const SupplierPhoneNumber = ({ phoneNumber }) => {
  const [showAlert, setShowAlert] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(phoneNumber).then(
      () => {
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      },
      (err) => {
        console.error("Errore durante la copia del numero di telefono: ", err);
      }
    );
  };

  return (
    <>
      {phoneNumber ? (
        <Dropdown className="p-0">
          <Dropdown.Toggle variant="" id="dropdown-basic" className="p-0">
            Cell: {phoneNumber}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item href={`tel:${phoneNumber}`}>Chiama</Dropdown.Item>
            <Dropdown.Item onClick={handleCopy}>Copia</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ) : (
        <p className="mb-0">Cell: N/A</p>
      )}
      {showAlert &&
        ReactDOM.createPortal(
          <Alert
            variant="success"
            onClose={() => setShowAlert(false)}
            dismissible
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              zIndex: 1000,
            }}
          >
            Numero di telefono copiato negli appunti
          </Alert>,
          document.getElementById("alert-root")
        )}
    </>
  );
};

export default SupplierPhoneNumber;
