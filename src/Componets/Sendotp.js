import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Main.css';
import 'boxicons/css/boxicons.min.css';

const SendOTP = (Newdata) => {
  const { userId, authToken } = Newdata;
  console.log('userId for send otp:', userId);
  console.log('authToken: sendotp', authToken);
  const navigate = useNavigate();
  const [apiResponse, setApiResponse] = useState('');
  const [error, setError] = useState('');

  const sendOTP = () => {
    if(authToken == undefined){
      setError("Token Not Found")
    }else{
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
            alert(data.OTP);
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
        });
    } catch (error) {
      console.error('Error:', error);
      setError('Session Expired, Please Log In again');
      setApiResponse('');
    }
  };
}
  

  return (
    <div className="container">
      <header>
        <i className="bx bxs-check-shield"></i>
      </header>
      <h4>This will send the OTP to your email ID</h4>
      <button className='sbtn' onClick={sendOTP}>Send OTP</button>
      {apiResponse && <label style={{ color: 'green' }}>{apiResponse}</label>}
      {error && <label style={{ color: 'red' }}>{error}</label>}
    </div>
  );
};

export default SendOTP;
