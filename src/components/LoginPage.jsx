// import { useEffect, useState } from "react";
// import { Card, Form, Button, Alert } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { setAccessToken } from "../redux/actions";

// const LoginPage = () => {
//   const [user, setUser] = useState(null);
//   const [password, setPassword] = useState(null);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [showAlert, setShowAlert] = useState(false);
//   const accessToken = useSelector((state) => state.user.accessToken);

//   const goToProfile = (e) => {
//     e.preventDefault();
//     dispatch(setAccessToken(user, password));
//     if (!accessToken && user && password) {
//       setShowAlert(true);
//     }
//   };

//   useEffect(() => {
//     if (accessToken) {
//       navigate("/home");
//     }
//   }, [accessToken, navigate, user, password]);

//   return (
//     <div className="card-container d-flex justify-content-center align-items-center">
//       <Card className="login-card ms-auto me-auto">
//         <Card.Body>
//           <div className="d-flex justify-content-center mb-3"></div>
//           <Card.Title className="mb-4 fs-3">Accedi</Card.Title>
//           <Form onSubmit={goToProfile}>
//             <Form.Group className="mb-3">
//               <Form.Label>Username</Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder="Inserisci il tuo Username"
//                 onChange={(e) => setUser(e.target.value)}
//                 required
//               />
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Password</Form.Label>
//               <Form.Control
//                 type="password"
//                 placeholder="Password"
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//               {showAlert && (
//                 <Alert
//                   className="mt-3"
//                   variant="danger"
//                   onClose={() => setShowAlert(false)}
//                   dismissible
//                 >
//                   Password e/o Username errati
//                 </Alert>
//               )}
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Check type="checkbox" label="Ricordami" />
//             </Form.Group>
//             <div className="d-flex justify-content-center align-items-center">
//               <Button
//                 variant="primary"
//                 type="submit"
//                 className="custom-button py-2"
//               >
//                 Accedi
//               </Button>
//             </div>
//           </Form>
//           <Card.Link href="#" className="d-block mt-5">
//             Password dimenticata?
//           </Card.Link>
//         </Card.Body>
//       </Card>
//     </div>
//   );
// };
// export default LoginPage;

// src/components/LoginPage.js
// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { auth } from "../firebaseConfig";
// import { setUser } from "../redux/actions";

// const LoginPage = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const userCredential = await auth.signInWithEmailAndPassword(
//         email,
//         password
//       );
//       dispatch(setUser(userCredential.user));
//       navigate("/home");
//     } catch (error) {
//       console.error("Error logging in: ", error);
//     }
//   };

//   const handleSignUp = async (e) => {
//     e.preventDefault();
//     try {
//       const userCredential = await auth.createUserWithEmailAndPassword(
//         email,
//         password
//       );
//       console.log("Utente registrato");
//       dispatch(setUser(userCredential.user));
//       navigate("/");
//     } catch (error) {
//       console.error("Error signing up: ", error);
//     }
//   };

//   return (
//     <div>
//       <h2>Login</h2>
//       <form>
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="Email"
//         />
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="Password"
//         />
//         <button onClick={handleLogin}>Login</button>
//         <button onClick={handleSignUp}>Sign Up</button>
//       </form>
//     </div>
//   );
// };

// export default LoginPage;

// src/components/LoginPage.js
// src/components/LoginPage.js
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   getAuth,
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
//   sendEmailVerification,
//   updateProfile,
// } from "firebase/auth";

// const LoginPage = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [phone, setPhone] = useState("");
//   const [photoURL, setPhotoURL] = useState("");
//   const navigate = useNavigate();
//   const auth = getAuth();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       navigate("/home");
//     } catch (error) {
//       console.error("Error logging in: ", error);
//     }
//   };

//   const handleSignUp = async (e) => {
//     e.preventDefault();
//     try {
//       const userCredential = await createUserWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );
//       const user = userCredential.user;

//       await updateProfile(user, {
//         phoneNumber: phone,
//         photoURL: photoURL,
//       });

//       await sendEmailVerification(user);
//       navigate("/home");
//     } catch (error) {
//       console.error("Error signing up: ", error);
//     }
//   };

//   return (
//     <div>
//       <h2>Login</h2>
//       <form>
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="Email"
//         />
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="Password"
//         />
//         <button onClick={handleLogin}>Login</button>
//       </form>

//       <h2>Sign Up</h2>
//       <form>
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="Email"
//         />
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="Password"
//         />
//         <input
//           type="text"
//           value={phone}
//           onChange={(e) => setPhone(e.target.value)}
//           placeholder="Phone Number"
//         />
//         <input
//           type="text"
//           value={photoURL}
//           onChange={(e) => setPhotoURL(e.target.value)}
//           placeholder="Photo URL"
//         />
//         <button onClick={handleSignUp}>Sign Up</button>
//       </form>
//     </div>
//   );
// };

// export default LoginPage;

//--------------------------------------------

import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider"; // Importa useAuth
import GoogleSignIn from "./GoogleSignIn";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // Usa login e signup dal contesto

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/home");
    } catch (error) {
      console.error("Error logging in: ", error);
    }
  };
  return (
    <Form id="login-form" className="bg-section">
      <h2 className="border-bottom border-primary pb-3 mb-4">Login</h2>
      <Form.Group className="d-flex flex-column w-100">
        <Form.Label className="text-center ">Email</Form.Label>
        <Form.Control
          className="w-100 m-auto"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        ></Form.Control>
      </Form.Group>
      <Form.Group className="d-flex flex-column w-100 mb-3">
        <Form.Label className="text-center  mt-3">Password</Form.Label>
        <Form.Control
          className="w-100 m-auto"
          type="password"
          required
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        ></Form.Control>
      </Form.Group>

      <GoogleSignIn></GoogleSignIn>
      <div className="text-end mt-3">
        <Button
          className="rounded-3 px-3 btnEdit cardUserGame"
          onClick={handleLogin}
        >
          Login
        </Button>
      </div>
    </Form>
  );
};

export default LoginPage;
