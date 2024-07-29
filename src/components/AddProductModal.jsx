import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Spinner } from "react-bootstrap";
import { db } from "../firebaseConfig";
import { Plus } from "react-bootstrap-icons";
import * as XLSX from "xlsx";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

const AddProductModal = ({ show, onHide }) => {
  const [productName, setProductName] = useState("");
  const [unitOfMeasure, setUnitOfMeasure] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSuppliers = async () => {
      console.log("Fetching suppliers...");
      try {
        const suppliersCollection = await getDocs(collection(db, "fornitori"));
        const suppliersData = suppliersCollection.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSuppliers(suppliersData);
      } catch (error) {
        console.error("Errore durante il recupero dei fornitori:", error);
      }
    };
    if (show) {
      fetchSuppliers();
    }
  }, [show]);

  const updateSupplierProducts = async (
    productRef,
    productName,
    unitOfMeasure,
    supplierId
  ) => {
    const supplierRef = doc(db, "fornitori", supplierId);

    const supplierDoc = await getDoc(supplierRef);

    if (supplierDoc.exists) {
      const supplierData = supplierDoc.data();
      let updatedProducts = supplierData.products || [];

      if (productRef) {
        // Aggiunta di un singolo prodotto
        updatedProducts = [
          ...updatedProducts,
          { name: productName, unitOfMeasure, id: productRef },
        ];
      } else {
        // Aggiunta multipla di prodotti
        updatedProducts = [
          ...updatedProducts,
          ...productName.map((name, index) => ({
            name,
            unitOfMeasure: unitOfMeasure[index],
            id: supplierId,
          })),
        ];
      }

      await updateDoc(supplierRef, { products: updatedProducts });
    } else {
      console.error(`Il fornitore con ID ${supplierId} non esiste.`);
    }
  };

  const handleAddProduct = async (event) => {
    event.preventDefault();
    if (!productName || !unitOfMeasure || !supplierId) {
      alert("Per favore, compila tutti i campi obbligatori.");
      return;
    }
    try {
      const productData = {
        name: productName,
        unitOfMeasure,
        supplierId,
      };

      const docRef = await addDoc(collection(db, "prodotti"), productData);
      const productRef = docRef.id; // Ottieni l'ID del documento appena creato

      await updateSupplierProducts(
        productRef,
        productName,
        unitOfMeasure,
        supplierId
      );

      setProductName("");
      setSupplierId("");
      setUnitOfMeasure("");
      onHide();
    } catch (error) {
      console.error("Errore durante l'aggiunta del prodotto:", error);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    // Mappaggio delle unità di misura da Excel alle abbreviazioni nel sistema
    const unitOfMeasureMappings = {
      Bottiglia: "BT",
      Cartone: "CT",
      Confezione: "CF",
      Pezzo: "PZ",
      Fusto: "FS",
      Flacone: "FL",
      Cassa: "CS",
      Tanica: "TN",
      Rotolo: "RT",
      Kilogrammo: "KG",
      Grammo: "GR",
      Litro: "LT",
    };

    reader.onload = (e) => {
      const arrayBuffer = e.target.result;
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const mappedData = jsonData
        .slice(1)
        .map((row) => ({
          name: row[1] ? row[1].toString() : null,
          unitOfMeasure: row[2]
            ? unitOfMeasureMappings[row[2].toString()] || row[2].toString()
            : null,
        }))
        .filter((item) => item.name && item.unitOfMeasure);
      setExcelData(mappedData);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleSaveExcelData = async () => {
    if (!supplierId || excelData.length === 0) {
      alert("Per favore, seleziona un fornitore e carica un file Excel.");
      return;
    }

    setIsLoading(true);

    try {
      for (const item of excelData) {
        const productData = {
          supplierId,
          name: item.name,
          unitOfMeasure: item.unitOfMeasure,
        };
        const docRef = await addDoc(collection(db, "prodotti"), productData);
        const productRef = docRef.id;
        await updateSupplierProducts(
          productRef,
          item.name,
          item.unitOfMeasure,
          supplierId
        );
      }

      // alert("Prodotti caricati con successo!");
      // onHide();
    } catch (error) {
      console.error(
        "Errore durante il salvataggio dei prodotti da Excel:",
        error
      );
    } finally {
      setIsLoading(false);
      onHide();
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      {/* <Modal.Header closeButton></Modal.Header> */}
      <Modal.Header
        closeButton
        className="d-flex justify-content-center align-items-center pb-4 w-100 border-bottom border-3 border-primary"
      >
        <Plus className="col-2"></Plus>
        <Modal.Title className=" col-8 text-center fs-3 m-0">
          Aggiungi prodotto
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading ? (
          <div
            className="d-flex flex-column justify-content-center align-items-center"
            style={{ height: "200px" }}
          >
            <Spinner
              animation="border"
              role="status"
              variant="primary"
            ></Spinner>
            <div className="sr-only">Salvando i prodotti...</div>
          </div>
        ) : (
          <Form onSubmit={handleAddProduct}>
            <Form.Group controlId="productName" className="mb-2">
              <Form.Label>Nome Prodotto</Form.Label>
              <Form.Control
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Inserisci il nome del prodotto"
                required
              />
            </Form.Group>
            <Form.Group controlId="unitOfMeasure" className="mb-2">
              <Form.Label>Unità di Misura</Form.Label>
              <Form.Control
                as="select"
                value={unitOfMeasure}
                onChange={(e) => setUnitOfMeasure(e.target.value)}
                required
              >
                <option value="">Seleziona l'unità di misura</option>
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
            </Form.Group>
            <Form.Group controlId="supplierId" className="mb-2">
              <Form.Label>Fornitore</Form.Label>
              <Form.Control
                as="select"
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
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
            <Modal.Footer className="border-0">
              <Button variant="primary" type="submit">
                Aggiungi Prodotto
              </Button>
            </Modal.Footer>
            <hr />
            <h5>Carica Prodotti da Excel</h5>
            <Form.Group controlId="supplierId" className="mb-2">
              <Form.Label>Fornitore</Form.Label>
              <Form.Control
                as="select"
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
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
            <Form.Group controlId="excelFile">
              <Form.Label>Carica File Excel</Form.Label>
              <Form.Control type="file" onChange={handleFileUpload} />
            </Form.Group>
            <Modal.Footer className="border-0">
              <Button variant="secondary" onClick={onHide}>
                Chiudi
              </Button>
              <Button variant="primary" onClick={handleSaveExcelData}>
                Salva Prodotti da Excel
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default AddProductModal;
