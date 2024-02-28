import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Main.css';
import 'boxicons/css/boxicons.min.css';

const SendOTP = ({ userId, authToken }) => {
  const navigate = useNavigate();
  const [apiResponse, setApiResponse] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingSendOTP, setLoadingSendOTP] = useState(false);
  const [buttonText, setButtonText] = useState('Get OTP');

  useEffect(() => {
    if (userId && authToken) {
      setLoading(false);
    }
  }, [userId, authToken]);

  const sendOTP = async () => {
    if (!authToken) {
      setError('Token Not Found');
      return;
    }

    setLoadingSendOTP(true);
    setButtonText('Sending...');

    try {
      const apiUrl = 'https://huf6ubili4.execute-api.ap-south-1.amazonaws.com/DEV/send_viewer_otp';
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
        console.log(`Send Done - OTP: ${data.OTP}`)
        setApiResponse(`Send Done - OTP: ${data.OTP}`);
        navigate(`/verify-otp`);
      } else {
        setError(data.message || 'Error sending OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error sending OTP. Please try again.');
    } finally {
      setLoadingSendOTP(false);
      setButtonText('Get OTP');
    }
  };

  return (
    <div>
      {loading ? (
        <div className="loader1"></div>
      ) : (
        <div className="container">
          {/* <header>
            <i className="bx bxs-check-shield"></i>
          </header> */}
          <h4>This will send the OTP <br/> to your email ID</h4>
          <button className='sbtn' onClick={sendOTP} disabled={loadingSendOTP}>
            {buttonText}
          </button>
          {loadingSendOTP && <div className="loader"></div>}
          {apiResponse && <label style={{ color: 'green' }}>{apiResponse}</label>}
          {error && <label style={{ color: 'red' }}>{error}</label>}
        </div>
      )}
    </div>
  );
};

export default SendOTP;
