import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig"; // Importa l'istanza di Firestore

const AddProducts = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [productName, setProductName] = useState("");
  const [unitOfMeasure, setUnitOfMeasure] = useState("");
  const [availableUnits] = useState(["kg", "g", "lt", "ml"]); // Opzioni di unità di misura disponibili

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const snapshot = await db.collection("fornitori").get();
        const supplierList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSuppliers(supplierList);
      } catch (error) {
        console.error("Errore durante il recupero dei fornitori:", error);
        // Gestire l'errore, mostrare un messaggio all'utente, ecc.
      }
    };
    fetchSuppliers();
  }, []);

  const handleAddProduct = async () => {
    try {
      const supplierRef = db.collection("fornitori").doc(selectedSupplier);
      const doc = await supplierRef.get();
      if (!doc.exists) {
        console.error("Fornitore non trovato!");
        return;
      }

      const supplierData = doc.data();
      const updatedProducts = [
        ...supplierData.products,
        { name: productName, unitOfMeasure },
      ];

      await supplierRef.update({
        products: updatedProducts,
      });

      console.log("Prodotto aggiunto con successo!");
      // Aggiornare lo stato o mostrare un messaggio di successo
    } catch (error) {
      console.error("Errore durante l'aggiunta del prodotto:", error);
      // Gestire l'errore, mostrare un messaggio all'utente, ecc.
    }
  };

  return (
    <div>
      <h2>Aggiungi Prodotti per Fornitore</h2>
      <form>
        <label>Seleziona Fornitore:</label>
        <select
          value={selectedSupplier}
          onChange={(e) => setSelectedSupplier(e.target.value)}
        >
          <option value="">Seleziona...</option>
          {suppliers.map((supplier) => (
            <option key={supplier.id} value={supplier.id}>
              {supplier.name}
            </option>
          ))}
        </select>
        <br />
        <label>Nome Prodotto:</label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <br />
        <label>Unità di Misura:</label>
        <select
          value={unitOfMeasure}
          onChange={(e) => setUnitOfMeasure(e.target.value)}
        >
          <option value="">Seleziona...</option>
          {availableUnits.map((unit, index) => (
            <option key={index} value={unit}>
              {unit}
            </option>
          ))}
        </select>
        <br />
        <button type="button" onClick={handleAddProduct}>
          Aggiungi Prodotto
        </button>
      </form>
    </div>
  );
};

export default AddProducts;
