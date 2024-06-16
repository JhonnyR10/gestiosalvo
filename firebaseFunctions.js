import { db } from "./src/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

const addSupplier = async (supplier) => {
  try {
    const docRef = await addDoc(collection(db, "suppliers"), supplier);
    console.log("Supplier added with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding supplier: ", e);
  }
};

export { addSupplier };
