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

// import React, { useContext } from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import LoginPage from "./components/LoginPage";
// import Home from "./components/Home";
// import AddSupplier from "./components/AddSupplier";
// import SupplierList from "./components/SuppliersList";
// import SupplierProfile from "./components/SupplierProfile";
// import ProductsList from "./components/ProductsList";
// import OrderCreation from "./components/OrderCreation";
// import OrderSummary from "./components/OrderSummary";
// import OrdersList from "./components/OrdersList";
// import ProtectedRoute from "./components/ProtectedRoute";
// import { AuthContext } from "./components/AuthProvider";

// const App = () => {
//   const { currentUser } = useContext(AuthContext);
//   return (
//     <Routes>
//       <Route path="/" element={<Navigate to="/login" />} />
//       <Route path="/login" element={<LoginPage />} />
//       {currentUser && (
//         <>
//           <Route path="/home" element={<Home />} />
//           <Route path="/addSupp" element={<AddSupplier />} />
//           <Route path="/addOrd" element={<OrderCreation />} />
//           <Route path="/listSupp" element={<SupplierList />} />
//           <Route path="/listSupp/:id" element={<SupplierProfile />} />
//           <Route path="/listProd" element={<ProductsList />} />
//           <Route path="/order-summary/:orderId" element={<OrderSummary />} />
//           <Route path="/listOrd" element={<OrdersList />} />
//         </>
//       )}
//     </Routes>
//   <Routes>
//     <Route path="/" element={<LoginPage />} />
//     <Route
//       path="/home"
//       element={
//         <ProtectedRoute>
//           <Home />
//         </ProtectedRoute>
//       }
//     />
//     <Route
//       path="/addSupp"
//       element={
//         <ProtectedRoute>
//           <AddSupplier />
//         </ProtectedRoute>
//       }
//     />
//     <Route
//       path="/addOrd"
//       element={
//         <ProtectedRoute>
//           <OrderCreation />
//         </ProtectedRoute>
//       }
//     />
//     <Route
//       path="/listSupp"
//       element={
//         <ProtectedRoute>
//           <SupplierList />
//         </ProtectedRoute>
//       }
//     />
//     <Route
//       path="/listSupp/:id"
//       element={
//         <ProtectedRoute>
//           <SupplierProfile />
//         </ProtectedRoute>
//       }
//     />
//     <Route
//       path="/listProd"
//       element={
//         <ProtectedRoute>
//           <ProductsList />
//         </ProtectedRoute>
//       }
//     />
//     <Route
//       path="/order-summary/:orderId"
//       element={
//         <ProtectedRoute>
//           <OrderSummary />
//         </ProtectedRoute>
//       }
//     />
//     <Route
//       path="/listOrd"
//       element={
//         <ProtectedRoute>
//           <OrdersList />
//         </ProtectedRoute>
//       }
//     />
//   </Routes>
//   );
// };

// export default App;

import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import AddSupplier from "./components/AddSupplier";
import SupplierList from "./components/SuppliersList";
import SupplierProfile from "./components/SupplierProfile";
import ProductsList from "./components/ProductsList";
import OrderCreation from "./components/OrderCreation";
import OrderSummary from "./components/OrderSummary";
import OrdersList from "./components/OrdersList";
import { useAuth } from "./AuthProvider";
import RegisterLoginCard from "./components/RegisterLoginCard";

const App = () => {
  const { currentUser } = useAuth();
  console.log("App: currentUser", currentUser);

  return (
    <Routes>
      <Route path="/" element={<RegisterLoginCard />} />
      {currentUser ? (
        <>
          <Route path="/home" element={<Home />} />
          <Route path="/addSupp" element={<AddSupplier />} />
          <Route path="/addOrd" element={<OrderCreation />} />
          <Route path="/listSupp" element={<SupplierList />} />
          <Route path="/listSupp/:id" element={<SupplierProfile />} />
          <Route path="/listProd" element={<ProductsList />} />
          <Route path="/order-summary/:orderId" element={<OrderSummary />} />
          <Route path="/listOrd" element={<OrdersList />} />
        </>
      ) : (
        <Route path="/" element={<RegisterLoginCard />} />
      )}
    </Routes>
  );
};

export default App;
