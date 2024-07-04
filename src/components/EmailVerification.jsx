import React from "react";
import { getAuth, sendEmailVerification } from "firebase/auth";

const EmailVerification = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  const handleSendVerificationEmail = async () => {
    try {
      await sendEmailVerification(user);
      alert("Verification email sent!");
    } catch (error) {
      console.error("Error sending verification email: ", error);
    }
  };

  return (
    <div>
      <h2>Email Verification</h2>
      <button onClick={handleSendVerificationEmail}>
        Send Verification Email
      </button>
    </div>
  );
};

export default EmailVerification;
