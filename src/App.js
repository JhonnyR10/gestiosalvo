// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.min.js";
// import "./App.css";
// import {
//   createBrowserRouter,
//   RouterProvider,
//   Route,
//   createRoutesFromElements,
// } from "react-router-dom";
// import LoginPage from "./components/LoginPage";
// import Home from "./components/Home";
// import AddSupplier from "./components/AddSupplier";
// import SupplierList from "./components/SuppliersList";
// import SupplierProfile from "./components/SupplierProfile";
// import ProductsList from "./components/ProductsList";
// import OrderCreation from "./components/OrderCreation";
// import OrderSummary from "./components/OrderSummary";
// import OrdersList from "./components/OrdersList";

// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <>
//       <Route path="/" element={<LoginPage />} />
//       <Route path="/home" element={<Home />} />
//       <Route path="/addSupp" element={<AddSupplier />} />
//       <Route path="/addOrd" element={<OrderCreation />} />
//       <Route path="/listSupp" element={<SupplierList />} />
//       <Route path="/listSupp/:id" element={<SupplierProfile />} />
//       <Route path="/listProd" element={<ProductsList />} />
//       <Route path="/order-summary" element={<OrderSummary />} />
//       <Route path="/listOrd" element={<OrdersList />} />
//     </>
//   )
// );

// function App() {
//   return (
//     <>
//       <RouterProvider router={router}></RouterProvider>;
//     </>
//   );
// }

// export default App;

import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Home from "./components/Home";
import AddSupplier from "./components/AddSupplier";
import SupplierList from "./components/SuppliersList";
import SupplierProfile from "./components/SupplierProfile";
import ProductsList from "./components/ProductsList";
import OrderCreation from "./components/OrderCreation";
import OrderSummary from "./components/OrderSummary";
import OrdersList from "./components/OrdersList";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/home" element={<Home />} />
      <Route path="/addSupp" element={<AddSupplier />} />
      <Route path="/addOrd" element={<OrderCreation />} />
      <Route path="/listSupp" element={<SupplierList />} />
      <Route path="/listSupp/:id" element={<SupplierProfile />} />
      <Route path="/listProd" element={<ProductsList />} />
      <Route path="/order-summary/:orderId" element={<OrderSummary />} />
      <Route path="/listOrd" element={<OrdersList />} />
    </Routes>
  );
};

export default App;
