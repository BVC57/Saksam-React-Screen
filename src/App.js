import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SendOTP from './Componets/Sendotp';
import Verifyotp from './Componets/Verifyotp';
import Profilepage from "./Componets/Profile";

const App = () => {
  return (
    <Router>
      <Routes>
          <Route path="/"  element= { <SendOTP/>} />
          {/* <Route path="/verify-otp/:id"  element= { <Verifyotp/>} /> */}
          <Route path="/verify-otp"  element= { <Verifyotp/>} />
          <Route path="/profile"  element= { <Profilepage/>} />
      </Routes>
    </Router>
  );
};

export default App;
