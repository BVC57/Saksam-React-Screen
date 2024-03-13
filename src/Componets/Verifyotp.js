import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../Images/logo.png';
import Limg from '../Images/Group 427318467.png';
import Rimg from '../Images/Group 427318468.png';
import "./Main.css";

const OTPVerification = ({ userId, authToken }) => {
  // console.log("from votp", userId);
  // console.log("from votp", authToken);
  const navigate = useNavigate();
  const [otpValues, setOtpValues] = useState(Array(6).fill(""));
  const [buttonText, setButtonText] = useState("Submit");
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(true);
  const [showBody, setShowBody] = useState(false);

  useEffect(() => {
    if (userId && authToken) {
      setLoading(false);
    }
    sendOTP(); // Call sendOTP function when component mounts
  }, [ userId,authToken]);

  useEffect(() => {
    document.addEventListener('paste', handlePaste);

    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [otpValues]);

  const handlePaste = (event) => {
    event.preventDefault();
    const pastedData = event.clipboardData.getData('Text');
    const pastedValues = pastedData.match(/\d/g); // Extract only digits
    if (pastedValues && pastedValues.length <= 6) {
      const updatedValues = [...otpValues];
      pastedValues.forEach((value, index) => {
        updatedValues[index] = value;
      });
      setOtpValues(updatedValues);
      updateButtonText(updatedValues);
    }
  };

  const sendOTP = async () => {
    if (!authToken) {
      setLoading(true);
      // setErrorMessage('Token Not Found');
      return;
    }

    try {
      const apiUrl = 'https://bjejzjksx9.execute-api.ap-south-1.amazonaws.com/DEV/send_viewer_otp';
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      };

      const requestData = { id: userId };
      const options = { method: 'POST', headers, body: JSON.stringify(requestData) };
      const response = await fetch(apiUrl, options);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.Status_Code === 200) {
        console.log(`Send Done - OTP: ${data.OTP}`);
        setShowBody(true);
        setLoading1(false);
      } else {
        alert(data.message);
        setLoading1(false)
        console.error('Error:', data.message);
        setErrorMessage(data.message || 'Error sending OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Error sending OTP. Please try again.');
    } finally {
    }
  };

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
        updatedValues[index] = "";
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
      const apiUrl = "https://bjejzjksx9.execute-api.ap-south-1.amazonaws.com/DEV/viewer_otp_verification";
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

  const handleClick = () => {
    sendOTP(); // Resend OTP when clicked
    alert("resend done");
  };

  return (
    <>
      {loading1 ? (
        <div className="loader1"></div>
        
      ) : (
        showBody && (
          <body>
            <div className='rimg'>
              <img src={Limg} alt='not found'></img>
            </div>
            <div className="container">
              <div className='lh'>
                <img src={logo} alt='not found'/>
                <h1>Saksham</h1>
              </div>
              <div className='hl'>
                <h3>Secure Access Required</h3>
                <p>For enhanced security and privacy, accessing User X's confidential report necessitates a One-Time Password (OTP) verification. Please enter the OTP sent to your registered email or mobile number in the field below to proceed.</p>
              </div>
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
              </form>
              <button type="button" className="vbtn" onClick={verifyOTP} disabled={loading}>
                {loading ? 'Verifying OTP...' : buttonText}
              </button>
              <a className='ro' href="/verify-otp" onClick={handleClick}>Resend OTP</a>
              {loading && <div className="loader"></div>}
              <div className="error-massage">
                {errorMessage && <label style={{ color: 'red' }}>{errorMessage}</label>}
              </div>
            </div>
            <div className='limg'>
              <img src={Rimg} alt='not found'></img>
            </div>
          </body>
        )
      )}
    </>
  );
};

export default OTPVerification;
