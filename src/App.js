import React, { useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Verifyotp from './Componets/Verifyotp';
import Profilepage from "./Componets/Profile";
import getUserData from './Componets/GetAuth';


const App = () => {
  const [userId, setUserId] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  const fetchData = async () => {
    const { userId, authToken } = await getUserData();
    setUserId(userId);
    setAuthToken(authToken);
  };

  // Call fetchData directly inside the component
  fetchData();

  return (
    <Router>
      <Routes>
          <Route path="/:id" element={<Verifyotp userId={userId} authToken={authToken} />}/>
          {/* <Route path="/resume/:userid"  element={<Resume/>} /> */}
          <Route path="/profile"  element={<Profilepage userId={userId} authToken={authToken} />} />
      </Routes>
    </Router>
  );
};

export default App;
