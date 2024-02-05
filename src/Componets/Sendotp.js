// SendOTP.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./Main.css";
import 'boxicons/css/boxicons.min.css';

const SendOTP = () => {
  const navigate = useNavigate(); // Get the history object from React Router

  const sendOTP = () => {
    alert('Send Done');
    // navigate(`/verify-otp/${10}`); // Navigate to the Verifyotp page
    navigate(`/verify-otp`);
  };

  return (
    <div className="container">
      <header>
        <i className="bx bxs-check-shield"></i>
      </header>
      <h4>Send the OTP in your Mail for verify</h4>
      <button className='sbtn' onClick={sendOTP}>Send OTP</button>
    </div>
  );
};

export default SendOTP;
