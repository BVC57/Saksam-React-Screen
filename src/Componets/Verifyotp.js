import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Main.css";

const OTPVerification = (Newdata) => {
  
  const { userId, authToken } = Newdata;

  // console.log('userId for verify otp:', userId);
  // console.log('authToken: verify otp', authToken);
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [buttonText, setButtonText] = useState("Enter OTP");
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // State variable to track loading status
  const navigate = useNavigate();

  useEffect(() => {
    document.getElementById("otpInput1").focus();
  }, []);

  useEffect(() => {
    const handlePaste = (e) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData('Text');
      if (pastedData.length === 6 && !isNaN(pastedData)) {
        const pastedValues = pastedData.split("");
        setOtpValues(pastedValues);
        const lastInput = document.getElementById(`otpInput${pastedValues.length}`);
        if (lastInput) {
          lastInput.focus();
        }
      }
    };
    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, []);
  

  const handleChange = (index, event) => {
    if(event.nativeEvent.inputType !== 'deleteContentBackward' ){

    const { value } = event.target;
  
    // Only accept numeric values and limit to one character
    if (/^\d*$/.test(value) && value.length <= 1) {
      const updatedValues = [...otpValues];
      updatedValues[index] = value;
      setOtpValues(updatedValues);
  
      // Set focus to the next input field if value is entered
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
  }
  };
  

  const handleBackspace = (index, event) => {
    if (event.key === "Backspace") {
      const updatedValues = [...otpValues];
      // console.log("updatedvlues",updatedValues)

      updatedValues[index] = ""; // Clear the current input value

      // If the current input is already empty, clear the previous input as well
      if (updatedValues[index] === "" && index > 0) {
        updatedValues[index] = "";
      }
  
      setOtpValues(updatedValues);
  
      // Set focus to the previous input field
      const prevIndex = index > 0 ? index - 1 : 0; // Ensure index does not go below 0
      const prevInput = document.getElementById(`otpInput${prevIndex + 1}`);
      if (prevInput) {
        prevInput.focus();
        // console.log(index)
      }
  
      updateButtonText(updatedValues);
    }
  };
  
  

  const updateButtonText = (updatedValues) => {
    const allInputsFilled = updatedValues.every((value) => value.trim() !== "");
    setButtonText(allInputsFilled ? "Verify OTP" : "Enter OTP");
  };

  const verifyOTP = async () => {
    setLoading(true); // Set loading to true when OTP verification starts
    const enteredOTP = otpValues.join("");
    console.log("Entered OTP:", enteredOTP);
    CallAPI(enteredOTP);
  };

  const CallAPI = async (otp) => {
    if(authToken === undefined){
      setErrorMessage("Token Not Found")
      setLoading(false); // Set loading to false if token is not found
    } else {
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
          // alert("API Response: " + JSON.stringify(data.message));
          navigate("/profile");
        } else if (data.Status_Code === 400 || data.Status_Code === 500) {
          setErrorMessage(data.message);
          setLoading(false);
        } else {
          setLoading(false);
          setErrorMessage(JSON.stringify(data.message));
        }
      } catch (error) {
        setLoading(false);
        console.error("Error during API call:", error);
        setErrorMessage("An error occurred during the API call. Check the console for more details.");
      } finally {
        setLoading(false); // Set loading to false after API call completes
      }
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
          {loading ? 'Verifying OTP.....' : buttonText} {/* Change button text if loading */}
        </button>
          {loading && <div className="loader"></div>} {/* Display loader if loading is true */}
      </form>
      <div className="error-massage">
        {errorMessage && <label style={{ color: 'red', textWrap:"wrap" }}>{errorMessage}</label>}
      </div>
    </div>
  );
};

export default OTPVerification;
