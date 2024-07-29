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
import { useAuth } from "../AuthProvider";
import { v4 as uuidv4 } from "uuid";

const AddMenuProductModal = ({ show, onHide, menuSelec }) => {
  const [menu, setMenu] = useState([]);
  const [menuName, setMenuName] = useState("");
  const [menuCategory, setMenuCategory] = useState("");
  const [selectedMenu, setSelectedMenu] = useState(menuSelec ? menuSelec : "");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState();
  const [excelData, setExcelData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuth();

  const fetchMenu = async () => {
    try {
      const menuSnapshot = await getDocs(collection(db, "menu"));
      const menuList = menuSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMenu(menuList);
    } catch (error) {
      console.error("Errore durante il recuper dei menu disponibili:", error);
    }
  };
  useEffect(() => {
    fetchMenu();
  }, [show]);

  const handleAddMenu = async (event) => {
    event.preventDefault();
    const time = new Date();
    setIsLoading(true);
    try {
      const menuData = {
        name: menuName,
        category: menuCategory,
        createdAt: time,
        createdBy: currentUser.displayName,
        products: [],
      };
      await addDoc(collection(db, "menu"), menuData);

      setMenuName("");
      setMenuCategory("");
      setIsLoading(false);
      fetchMenu();
    } catch (error) {
      console.log("Errore durante la creazione del menu:", error);
    }
  };

  const handleAddProduct = async (event) => {
    event.preventDefault();

    if (!productName || !price || !category || !selectedMenu) {
      alert("Per favore, compila tutti i campi obbligatori.");
      return;
    }

    setIsLoading(true);

    try {
      const menuRef = doc(db, "menu", selectedMenu);
      const menuDoc = await getDoc(menuRef);

      if (!menuDoc.exists) {
        alert("Il menu selezionato non esiste.");
        setIsLoading(false);
        return;
      }

      const productData = {
        name: productName,
        price: price,
        category: category,
        id: uuidv4(),
      };
      const menuData = menuDoc.data();
      const updatedProducts = [...(menuData.products || []), productData];

      await updateDoc(menuRef, { products: updatedProducts });

      setProductName("");
      setCategory("");
      setPrice("");
      setSelectedMenu(menuSelec ? menuSelec : "");
      onHide();
    } catch (error) {
      console.error("Errore durante l'aggiunta del prodotto:", error);
      alert(
        "Si è verificato un errore durante l'aggiunta del prodotto. Riprova più tardi."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const arrayBuffer = e.target.result;
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      console.log("JSON Data:", jsonData); // Debug print
      const mappedData = jsonData
        .slice(1)
        .map((row) => ({
          name: row[0] ? row[0].toString() : null,
          price: row[1] ? row[1].toString() : null,
          category: row[2] ? row[2].toString() : null,
        }))
        .filter((item) => item.name && item.price && item.category);

      setExcelData(mappedData);
      console.log("Excel Data:", mappedData); // Debug print
    };

    reader.readAsArrayBuffer(file);
  };

  const handleSaveExcelData = async () => {
    if (!selectedMenu) {
      alert("Per favore, seleziona un menu.");
      return;
    }

    setIsLoading(true);

    try {
      const menuRef = doc(db, "menu", selectedMenu);
      const menuDoc = await getDoc(menuRef);

      if (!menuDoc.exists) {
        alert("Il menu selezionato non esiste.");
        setIsLoading(false);
        return;
      }

      const menuData = menuDoc.data();
      const updatedProducts = [
        ...(menuData.products || []),
        ...excelData.map((item) => ({
          name: item.name,
          price: item.price,
          category: item.category,
          id: uuidv4(),
        })),
      ];

      await updateDoc(menuRef, { products: updatedProducts });
    } catch (error) {
      console.error(
        "Errore durante il salvataggio dei prodotti da Excel:",
        error
      );
      alert(
        "Si è verificato un errore durante il salvataggio dei prodotti. Riprova più tardi."
      );
    } finally {
      setIsLoading(false);
      onHide();
    }
  };

  const handleMenuChange = (event) => {
    setSelectedMenu(event.target.value);
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
            <div className="sr-only mt-2">Salvando il menu...</div>
          </div>
        ) : (
          <Form onSubmit={handleAddMenu}>
            <h5>Crea un Menù</h5>
            <Form.Group controlId="menuName" className="mb-2">
              <Form.Label>Nome menù</Form.Label>
              <Form.Control
                type="text"
                value={menuName}
                onChange={(e) => setMenuName(e.target.value)}
                placeholder="Inserisci il nome del Menù"
                required
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="menuName" className="mb-2">
              <Form.Label>Categoria menù</Form.Label>
              <Form.Control
                as="select"
                value={menuCategory}
                onChange={(e) => setMenuCategory(e.target.value)}
                required
              >
                <option value="">Seleziona la categoria del menu</option>
                <option value="CLIENTE">CLIENTE</option>
                <option value="DIPENDENTE">DIPENDENTE</option>
              </Form.Control>
            </Form.Group>
            <Modal.Footer className="border-0">
              <Button variant="primary" type="submit">
                Aggiungi Menu
              </Button>
            </Modal.Footer>
            <hr />
          </Form>
        )}
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
          <Form
            onSubmit={handleAddProduct}
            className={`${menu.length > 0 ? "" : "unShow"}`}
          >
            <h5>Aggiungi un prodotto al Menù</h5>
            <Form.Group controlId="formMenuSelect" className="mb-2">
              <Form.Label>Seleziona il Menu</Form.Label>
              <Form.Control
                as="select"
                value={selectedMenu}
                onChange={handleMenuChange}
              >
                <option value="">Tutti i Menù</option>
                {menu.map((menu) => (
                  <option key={menu.id} value={menu.id}>
                    {menu.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
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
            <Form.Group controlId="formProductPrice" className="mb-2">
              <Form.Label>Prezzo del Prodotto</Form.Label>
              <Form.Control
                type="number"
                placeholder="Inserisci il prezzo"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="productCategory" className="mb-2">
              <Form.Label>Categoria Prodotto</Form.Label>
              <Form.Control
                as="select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Seleziona la categoria del prodotto</option>
                <option value="BAR">BAR</option>
                <option value="DRINK">DRINK</option>
                <option value="FOOD">FOOD</option>
                <option value="GELATI">GELATI</option>
              </Form.Control>
            </Form.Group>
            <Modal.Footer className="border-0">
              <Button variant="primary" type="submit">
                Aggiungi Prodotto
              </Button>
            </Modal.Footer>
            <hr />
            <h5>Carica Prodotti da Excel</h5>
            <Form.Group controlId="formMenuSelect" className="mb-2">
              <Form.Label>Seleziona il Menu</Form.Label>
              <Form.Control
                as="select"
                value={selectedMenu}
                onChange={handleMenuChange}
              >
                <option value="">Tutti i Menù</option>
                {menu.map((menu) => (
                  <option key={menu.id} value={menu.id}>
                    {menu.name}
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

export default AddMenuProductModal;
