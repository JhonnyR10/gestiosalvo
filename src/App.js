import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import AddSupplier from "./components/AddSupplier";
import SupplierList from "./components/SuppliersList";
import SupplierProfile from "./components/SupplierProfile";
import ProductsList from "./components/ProductsList";
import OrderCreation from "./components/OrderCreation";
import OrderSummary from "./components/OrderSummary";

function App() {
  return (
    <BrowserRouter>
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/addSupp" element={<AddSupplier />} />
        <Route path="/addOrd" element={<OrderCreation />} />
        <Route path="/listSupp" element={<SupplierList />} />
        <Route path="/listSupp/:id" element={<SupplierProfile />} />
        <Route path="/listProd" element={<ProductsList />} />
        <Route path="/order-summary" element={<OrderSummary />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
