import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "./Main.css";

const OTPVerification = (Newdata) => {
  const { userId, authToken } = Newdata;
  console.log('userId for verify otp:', userId);
  console.log('authToken: verify otp', authToken);
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [buttonText, setButtonText] = useState("Enter OTP");
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.getElementById("otpInput1").focus();
  }, []);

  const handleChange = (index, value) => {
    const updatedValues = [...otpValues];
    updatedValues[index] = value;
    setOtpValues(updatedValues);

    const nextInput = document.getElementById(`otpInput${index + 2}`);
    if (nextInput && value !== "") {
      nextInput.focus();
    }

    updateButtonText(updatedValues);
  };

  const handleBackspace = (index, event) => {
    if (event.key === "Backspace" && index > 0) {
      const updatedValues = [...otpValues];
      updatedValues[index] = "";
      setOtpValues(updatedValues);
      const prevInput = document.getElementById(`otpInput${index}`);
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

  const verifyOTP = () => {
    const enteredOTP = otpValues.join("");
    console.log("Entered OTP:", enteredOTP);
    CallAPI(enteredOTP);
  };

  const CallAPI = async (otp) => {
    console.log(otp);
    const apiUrl = "https://huf6ubili4.execute-api.ap-south-1.amazonaws.com/DEV/viewer_otp_verification";
    const method = "POST";
    const requestBody = {
      id: `${userId}`,
      OTP: otp,
    };
    const token = `Bearer ${authToken}`;
    const requestOptions = {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(requestBody),
    };

    try {
      const response = await fetch(apiUrl, requestOptions);
      console.log("Response Status:", response.status);
      const data = await response.json();
      console.log("API Data:", data);

      // Handle the API response as needed
      if (data.Status_Code === 200) {
        alert("API Response: " + JSON.stringify(data.message));
        navigate("/profile");
      } else if (data.Status_Code === 400 || data.Status_Code === 500) {
        setErrorMessage(data.message);
      } else {
        setErrorMessage(JSON.stringify(data.message));
      }
    } catch (error) {
      console.error("Error during API call:", error);
      setErrorMessage("An error occurred during the API call. Check the console for more details.");
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
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleBackspace(index, e)}
            />
          ))}
        </div>
        <button type="button" className="vbtn" onClick={verifyOTP}>
          {buttonText}
        </button>
      </form>
      <div className="error-massage">
        {errorMessage && <label style={{ color: 'red', textWrap:"wrap" }}>{errorMessage}</label>}
      </div>
    </div>
  );
};

export default OTPVerification;
