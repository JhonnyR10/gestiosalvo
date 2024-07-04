// import React from "react";
// import ReactDOM from "react-dom/client";
// import "./index.css";
// import App from "./App";

// import "bootstrap/dist/css/bootstrap.min.css";
// import { Provider } from "react-redux";
// import store, { persistor } from "./redux/store";
// import { PersistGate } from "redux-persist/integration/react";

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <Provider store={store}>
//     <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
//       <App />
//     </PersistGate>
//   </Provider>
// );

// import React from "react";
// import { createRoot } from "react-dom/client";
// import "./App.css";
// import App from "./App";
// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.min.js";
// import { Provider } from "react-redux";
// import store, { persistor } from "./redux/store";
// import { PersistGate } from "redux-persist/integration/react";
// const router = createBrowserRouter([
//   {
//     path: "*",
//     element: <App />,
//     // Aggiungi altre rotte qui se necessario
//   },
// ]);

// const root = createRoot(document.getElementById("root"));

// root.render(
//   <Provider store={store}>
//     <RouterProvider router={router}>
//       <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
//         <App />
//       </PersistGate>
//     </RouterProvider>
//   </Provider>
// );

// index.js

import React from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./AuthProvider"; // Importa il provider del contesto di autenticazione
import "./App.css";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import { Provider } from "react-redux";
import store, { persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";

const router = createBrowserRouter([
  {
    path: "*",
    element: <App />,
    // Aggiungi altre rotte qui se necessario
  },
]);

const root = createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <AuthProvider>
      <RouterProvider router={router}>
        <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
          <App />
        </PersistGate>
      </RouterProvider>
    </AuthProvider>
  </Provider>
);
