import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Main.css";

const OTPVerification = ({ userId, authToken }) => {
  const navigate = useNavigate();
  const [otpValues, setOtpValues] = useState(Array(6).fill(""));
  const [buttonText, setButtonText] = useState("Enter OTP");
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.getElementById("otpInput1").focus();
  }, []);

  const handleChange = (index, event) => {
    const { value } = event.target;
    if (/^\d*$/.test(value) && value.length <= 1) {
      const updatedValues = [...otpValues];
      updatedValues[index] = value;
      setOtpValues(updatedValues);
      if (value !== "") {
        const nextIndex = index + 1;
        if (nextIndex < otpValues.length) {
          const nextInput = document.getElementById(`otpInput${nextIndex + 1}`);
          if (nextInput) {
            nextInput.focus();
          }
        }
      }
      updateButtonText(updatedValues);
    }
  };

  const handleBackspace = (index, event) => {
    if (event.key === "Backspace") {
      const updatedValues = [...otpValues];
      updatedValues[index] = "";
      if (updatedValues[index] === "" && index > 0) {
        updatedValues[index - 1] = "";
      }
      setOtpValues(updatedValues);
      const prevIndex = index > 0 ? index - 1 : 0;
      const prevInput = document.getElementById(`otpInput${prevIndex + 1}`);
      if (prevInput) {
        prevInput.focus();
      }
      updateButtonText(updatedValues);
    }
  };

  const updateButtonText = (updatedValues) => {
    const allInputsFilled = updatedValues.every((value) => value.trim() !== "");
    setButtonText(allInputsFilled ? "Verify OTP" : "Enter OTP");
  };

  const verifyOTP = async () => {
    setLoading(true);
    const enteredOTP = otpValues.join("");
    try {
      if (!authToken) {
        throw new Error("Token Not Found");
      }
      const apiUrl = "https://huf6ubili4.execute-api.ap-south-1.amazonaws.com/DEV/viewer_otp_verification";
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
        body: JSON.stringify({ id: userId, OTP: enteredOTP }),
      };
      const response = await fetch(apiUrl, requestOptions);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data.Status_Code === 200) {
        navigate("/profile");
      } else {
        throw new Error(data.message || "Error verifying OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      setErrorMessage(error.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header>
        <i className="bx bxs-check-shield"></i>
      </header>
      <h4>Please enter OTP received in your email id</h4>
      <form>
        <div className="input-field">
          {otpValues.map((value, index) => (
            <input
              key={index}
              type="number"
              id={`otpInput${index + 1}`}
              value={value}
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleBackspace(index, e)}
              maxLength={1}
            />
          ))}
        </div>
        <button type="button" className="vbtn" onClick={verifyOTP} disabled={loading}>
          {loading ? 'Verifying OTP...' : buttonText}
        </button>
        {loading && <div className="loader"></div>}
      </form>
      <div className="error-massage">
        {errorMessage && <label style={{ color: 'red' }}>{errorMessage}</label>}
      </div>
    </div>
  );
};

export default OTPVerification;
