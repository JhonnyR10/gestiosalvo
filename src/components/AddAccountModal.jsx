// import { useEffect, useState } from "react";
// import { Card, Form, Modal, Table } from "react-bootstrap";
// import { Plus } from "react-bootstrap-icons";
// import { useAuth } from "../AuthProvider";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../firebaseConfig";

// const AddAccountModal = ({ show, onHide }) => {
//   const { currentUser } = useAuth();
//   const [isLoading, setIsLoading] = useState(false);
//   const [menu, setMenu] = useState([]);
//   const [clients, setClients] = useState([]);
//   const [selectedMenu, setSelectedMenu] = useState(null);
//   const [selectedClient, setSelectedClient] = useState(null);
//   const [products, setProducts] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showSelectedOnly, setShowSelectedOnly] = useState(false);
//   const [orderItems, setOrderItems] = useState({});

//   const fetchMenu = async () => {
//     try {
//       const menuSnapshot = await getDocs(collection(db, "menu"));
//       const menuList = menuSnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setMenu(menuList);
//       console.log(menuList);
//     } catch (error) {
//       console.error("Errore durante il recuper dei menu disponibili:", error);
//     }
//   };
//   const fetchClients = async () => {
//     try {
//       const clientsSnapshot = await getDocs(collection(db, "clienti"));
//       const clientsList = clientsSnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setClients(clientsList);
//     } catch (error) {
//       console.log("Errore durante il recupero dei clienti disponibili:", error);
//     }
//   };
//   useEffect(() => {
//     fetchMenu();
//     fetchClients();
//   }, [show]);

//   const filteredProducts = products.filter(
//     (product) =>
//       product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
//       (showSelectedOnly ? orderItems[product.id]?.quantity > 0 : true)
//   );
//   const handleProductChange = (productId, key, value) => {
//     setOrderItems((prevItems) => ({
//       ...prevItems,
//       [productId]: {
//         ...prevItems[productId],
//         [key]: value,
//       },
//     }));
//     //    setUnsavedChanges(true);
//   };
//   return (
//     <Modal show={show} onHide={onHide} centered>
//       <Modal.Header
//         closeButton
//         className="d-flex justify-content-center align-items-center pb-4 w-100 border-bottom border-3 border-primary"
//       >
//         <Plus className="col-2"></Plus>
//         <Modal.Title className=" col-8 text-center fs-3 m-0">
//           Aggiungi Conto
//         </Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <Form>
//           <Form.Group controlId="clientChoise" className="mb-2">
//             <Form.Label>Cliente</Form.Label>
//             <Form.Control
//               as="select"
//               value={selectedClient}
//               onChange={(e) => setSelectedClient(e.target.value)}
//               required
//             >
//               <option value="">Seleziona cliente</option>
//               {clients.map((clients) => (
//                 <option key={clients.id} value={clients.id}>
//                   {clients.name} {clients.surname}
//                 </option>
//               ))}
//             </Form.Control>
//           </Form.Group>
//           <Form.Group controlId="menuChoice" className="mb-2">
//             <Form.Label>Menu</Form.Label>
//             <div className="container">
//               <div className="row">
//                 {menu.map((menu, index) => (
//                   <div className="col-4 mb-2 px-0" key={menu.id}>
//                     <Card
//                       className={` h-100 ${
//                         selectedMenu === menu.id ? "border-primary" : ""
//                       }`}
//                       onClick={() => {
//                         setSelectedMenu(menu.id);
//                         setProducts(menu.product);
//                       }}
//                       style={{ cursor: "pointer", width: "100%" }}
//                     >
//                       <Card.Body>
//                         <Card.Title className="sizeCardconto fontWeightCard">
//                           {menu.name}
//                         </Card.Title>
//                         <Card.Text className="sizeCardconto">
//                           Prodotti: {menu.products.length}
//                         </Card.Text>
//                         <Card.Text className="sizeCardconto">
//                           Categoria: {menu.category}
//                         </Card.Text>
//                       </Card.Body>
//                     </Card>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </Form.Group>
//           {selectedMenu && selectedClient && (
//             <Form.Group className="mt-2" controlId="formProductSearch">
//               <Form.Label>Ricerca Prodotto</Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder="Cerca per nome"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </Form.Group>
//           )}
//           <Form.Check
//             className="mt-3 formCheckordini"
//             type="checkbox"
//             label="Visualizza solo i prodotti selezionati"
//             checked={showSelectedOnly}
//             onChange={(e) => setShowSelectedOnly(e.target.checked)}
//           />
//           <Table striped bordered hover responsive size="sm">
//             <thead>
//               <tr>
//                 <th className="align-middle">#</th>
//                 <th className="align-middle">Nome</th>
//                 <th className="small-column align-middle">Quantità</th>
//                 <th className="align-middle">Unità di Misura</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredProducts.length > 0 ? (
//                 filteredProducts.map((product, index) => (
//                   <tr key={product.id}>
//                     <td className="align-middle text-center">{index + 1}</td>
//                     <td className="">{product.name}</td>
//                     <td className="align-middle">
//                       <Form.Control
//                         className="text-center small-column "
//                         size="sm"
//                         type="number"
//                         min="0"
//                         value={orderItems[product.id]?.quantity || ""}
//                         onChange={(e) =>
//                           handleProductChange(
//                             product.id,
//                             "quantity",
//                             e.target.value
//                           )
//                         }
//                       />
//                     </td>
//                     <td className="align-middle ">{product.price}</td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="4" className="text-center">
//                     Nessun prodotto trovato. Seleziona un Menù
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </Table>
//         </Form>
//       </Modal.Body>
//     </Modal>
//   );
// };
// export default AddAccountModal;
import { useEffect, useState } from "react";
import { Button, Card, Form, Modal, Nav, Table } from "react-bootstrap";
import { Plus } from "react-bootstrap-icons";
import { useAuth } from "../AuthProvider";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

const AddAccountModal = ({ show, onHide }) => {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [menu, setMenu] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [products, setProducts] = useState([]); // Inizializza come array vuoto
  const [searchTerm, setSearchTerm] = useState("");
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [orderItems, setOrderItems] = useState({});
  const [activeCategory, setActiveCategory] = useState("all");

  const fetchMenu = async () => {
    try {
      const menuSnapshot = await getDocs(collection(db, "menu"));
      const menuList = menuSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMenu(menuList);
      console.log(menuList);
    } catch (error) {
      console.error("Errore durante il recuper dei menu disponibili:", error);
    }
  };

  const fetchClients = async () => {
    try {
      const clientsSnapshot = await getDocs(collection(db, "clienti"));
      const clientsList = clientsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClients(clientsList);
    } catch (error) {
      console.log("Errore durante il recupero dei clienti disponibili:", error);
    }
  };

  useEffect(() => {
    fetchMenu();
    fetchClients();
  }, [show]);

  const categories = Array.from(
    new Set(products.map((p) => p.category))
  ).filter(Boolean);
  const allCategories = ["all", ...categories]; // Aggiungi "all" per mostrare tutti i prodotti

  //   const filteredProducts = products.filter(
  //     (product) =>
  //       product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
  //       (showSelectedOnly ? orderItems[product.id]?.quantity > 0 : true)
  //   );
  const filteredProducts = products.filter(
    (product) =>
      (activeCategory === "all" || product.category === activeCategory) &&
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (showSelectedOnly ? orderItems[product.id]?.quantity > 0 : true)
  );

  const handleProductChange = (productId, key, value) => {
    setOrderItems((prevItems) => ({
      ...prevItems,
      [productId]: {
        ...prevItems[productId],
        [key]: value,
      },
    }));
    //    setUnsavedChanges(true);
  };

  //   const saveOrUpdateAccount = async () => {
  //     setIsLoading(true);
  //     try {
  //       // Check if an account already exists for the client today
  //       const today = new Date().toISOString().slice(0, 10); // Format YYYY-MM-DD
  //       const accountQuery = query(
  //         collection(db, "conti"),
  //         where("clientId", "==", selectedClient),
  //         where("createdAt", ">=", Timestamp.fromDate(new Date(today)))
  //       );
  //       const existingAccountsSnapshot = await getDocs(accountQuery);

  //       const accountData = {
  //         clientId: selectedClient,
  //         products: Object.keys(orderItems).map((productId) => ({
  //           ...products.find((p) => p.id === productId),
  //           quantity: orderItems[productId]?.quantity,
  //         })),
  //         createdAt: new Date(),
  //         createdBy: currentUser.displayName || currentUser.email,
  //       };

  //       if (!existingAccountsSnapshot.empty) {
  //         // Update existing account
  //         const existingAccountDoc = existingAccountsSnapshot.docs[0];
  //         await updateDoc(existingAccountDoc.ref, accountData);
  //       } else {
  //         // Create new account
  //         const docRef = await addDoc(collection(db, "conti"), accountData);
  //         const newAccountId = docRef.id;

  //         // Add the new account reference to the client's account list
  //         const clientDocRef = doc(db, "clienti", selectedClient);
  //         const clientDoc = await getDoc(clientDocRef);
  //         const clientData = clientDoc.data();

  //         if (clientData) {
  //           const updatedAccounts = [
  //             ...(clientData.accounts || []),
  //             newAccountId,
  //           ];
  //           await updateDoc(clientDocRef, { accounts: updatedAccounts });
  //         }
  //       }
  //       setSelectedMenu("");
  //       setSelectedClient("");
  //       setSearchTerm("");
  //       setOrderItems({});
  //       onHide(); // Close the modal after saving
  //     } catch (error) {
  //       console.error("Errore durante il salvataggio del conto:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  const saveOrUpdateAccount = async () => {
    setIsLoading(true);
    try {
      // Check if an account already exists for the client today
      const today = new Date().toISOString().slice(0, 10); // Format YYYY-MM-DD
      const accountQuery = query(
        collection(db, "conti"),
        where("clientId", "==", selectedClient),
        where("createdAt", ">=", Timestamp.fromDate(new Date(today)))
      );
      const existingAccountsSnapshot = await getDocs(accountQuery);

      // Prepare new product data
      const newProducts = Object.keys(orderItems).map((productId) => ({
        ...products.find((p) => p.id === productId),
        quantity: orderItems[productId]?.quantity,
      }));

      if (!existingAccountsSnapshot.empty) {
        // Update existing account
        const existingAccountDoc = existingAccountsSnapshot.docs[0];
        const existingAccountData = (
          await getDoc(existingAccountDoc.ref)
        ).data();
        const existingProducts = existingAccountData.products || [];

        // Merge existing products with new products
        const updatedProducts = existingProducts.reduce(
          (acc, existingProduct) => {
            const newProduct = newProducts.find(
              (p) => p.id === existingProduct.id
            );
            if (newProduct) {
              acc.push({
                ...existingProduct,
                quantity: existingProduct.quantity + (newProduct.quantity || 0),
              });
            } else {
              acc.push(existingProduct);
            }
            return acc;
          },
          []
        );

        // Add any new products that were not in the existing products
        newProducts.forEach((newProduct) => {
          if (!existingProducts.some((p) => p.id === newProduct.id)) {
            updatedProducts.push(newProduct);
          }
        });

        await updateDoc(existingAccountDoc.ref, {
          products: updatedProducts,
          updatedAt: new Date(), // Optionally track when the account was last updated
        });
      } else {
        // Create new account
        const docRef = await addDoc(collection(db, "conti"), {
          clientId: selectedClient,
          products: newProducts,
          createdAt: new Date(),
          createdBy: currentUser.displayName || currentUser.email,
        });
        const newAccountId = docRef.id;

        // Add the new account reference to the client's account list
        const clientDocRef = doc(db, "clienti", selectedClient);
        const clientDoc = await getDoc(clientDocRef);
        const clientData = clientDoc.data();

        if (clientData) {
          const updatedAccounts = [
            ...(clientData.accounts || []),
            newAccountId,
          ];
          await updateDoc(clientDocRef, { accounts: updatedAccounts });
        }
      }
      setSelectedMenu("");
      setSelectedClient("");
      setSearchTerm("");
      setOrderItems({});
      onHide(); // Close the modal after saving
    } catch (error) {
      console.error("Errore durante il salvataggio del conto:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header
        closeButton
        className="d-flex justify-content-center align-items-center pb-4 w-100 border-bottom border-3 border-primary"
      >
        <Plus className="col-2"></Plus>
        <Modal.Title className="col-8 text-center fs-3 m-0">
          Aggiungi Conto
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="clientChoice" className="mb-2">
            <Form.Label>Cliente</Form.Label>
            <Form.Control
              as="select"
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              required
            >
              <option value="">Seleziona cliente</option>
              {clients?.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} {client.surname}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="menuChoice" className="mb-2">
            <Form.Label>Menu</Form.Label>
            <div className="container">
              <div className="row">
                {menu.map((menu) => (
                  <div className="col-4 mb-2 px-0" key={menu.id}>
                    <Card
                      className={`h-100 ${
                        selectedMenu === menu.id ? "border-primary" : ""
                      }`}
                      onClick={() => {
                        setSelectedMenu(menu.id);
                        setProducts(menu.products);
                        setActiveCategory("all");
                      }}
                      style={{ cursor: "pointer", width: "100%" }}
                    >
                      <Card.Body>
                        <Card.Title className="sizeCardconto fontWeightCard">
                          {menu.name}
                        </Card.Title>
                        <Card.Text className="sizeCardconto">
                          Prodotti: {menu.products.length}
                        </Card.Text>
                        <Card.Text className="sizeCardconto">
                          Categoria: {menu.category}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </Form.Group>
          {selectedMenu && selectedClient && (
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
          <Nav variant="tabs" className="mt-3 mb-3">
            {allCategories.map((category) => (
              <Nav.Item key={category}>
                <Nav.Link
                  eventKey={category}
                  active={activeCategory === category}
                  onClick={() => setActiveCategory(category)}
                  className="text-black p-2"
                >
                  {category === "all" ? "ALL" : category}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
          <Table striped bordered hover responsive size="sm">
            <thead>
              <tr>
                <th className="align-middle">#</th>
                <th className="align-middle">Nome</th>
                <th className="small-column align-middle">Quantità</th>
                <th className="align-middle">Prezzo</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <tr key={product.id}>
                    <td className="align-middle text-center">{index + 1}</td>
                    <td>{product.name}</td>
                    <td className="align-middle">
                      <Form.Control
                        className="text-center small-column"
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
                    <td className="align-middle text-center">
                      {product.price} €
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    Nessun prodotto trovato. Seleziona un Menù
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
          <Modal.Footer
            style={{ position: "sticky", bottom: 0, backgroundColor: "white" }}
          >
            <Button
              variant="primary"
              onClick={saveOrUpdateAccount}
              disabled={isLoading}
            >
              {isLoading ? "Salvataggio in corso..." : "Salva Conto"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddAccountModal;
