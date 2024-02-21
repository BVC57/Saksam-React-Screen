import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Main.css';
import 'boxicons/css/boxicons.min.css';

const SendOTP = ({ userId, authToken }) => {
  console.log('userId for send otp:', userId);
  console.log('authToken: sendotp', authToken);
  const navigate = useNavigate();
  const [apiResponse, setApiResponse] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // Initially set loading to true
  const [loading1, setLoading1] = useState(false); // Initially set loading to false
  const [buttonText, setButtonText] = useState('Send OTP');

  useEffect(() => {
    if (userId && authToken) {
      setLoading(false); // If userId and authToken are available, set loading to false
    }
  }, [userId, authToken]);

  const sendOTP = () => {
    if(authToken === undefined){
      setError("Token Not Found")
    } else {
      setLoading1(true); // Set loading to true when OTP sending starts
      setButtonText('Sending.....'); // Change button text to "Sending OTP"
      try {
        const apiUrl = 'https://huf6ubili4.execute-api.ap-south-1.amazonaws.com/DEV/send_viewer_otp';
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        };
    
        const requestData = {
          id: `${userId}`,
        };
    
        const options = {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(requestData),
        };
    
        fetch(apiUrl, options)
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            if (data.Status_Code === 200) {
              console.log(data);
              // alert(data.OTP);
              setApiResponse(`Send Done - OTP: ${data.OTP}`);
              setError('');
              navigate(`/verify-otp`);
            } else {
              setError(`${data.message}`);
            }
          })
          .catch(error => {
            console.error('Error:', error);
            setError('Error sending OTP. Please try again.');
            setApiResponse('');
          })
          .finally(() => {
            setLoading(false); // Set loading to false when OTP sending is complete
            setButtonText('Send OTP'); // Reset button text to "Send OTP"
          });
      } catch (error) {
        console.error('Error:', error);
        setError('Session Expired, Please Log In again');
        setApiResponse('');
        setLoading(false); // Set loading to false in case of an error
        setButtonText('Send OTP'); // Reset button text to "Send OTP"
      }
    }
  };

  return (
    <div>
      {loading ? (
        <div className="loader1"></div> // Display loader when loading is true
      ) : (
        <div className="container">
          <header>
            <i className="bx bxs-check-shield"></i>
          </header>
          <h4>This will send the OTP to your email ID</h4>
          <button className='sbtn' onClick={sendOTP} disabled={loading}>{buttonText}</button>
          {loading1 && <div className="loader"></div>} {/* Display loader if loading is true */}
          {apiResponse && <label style={{ color: 'green' }}>{apiResponse}</label>}
          {error && <label style={{ color: 'red' }}>{error}</label>}
        </div>
      )}
    </div>
  );
};

export default SendOTP;
