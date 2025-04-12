import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import Home from './components/Home';
import ProductDashboard from './components/ProductDashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <Router>
      <div>
        <h1>Panel użytkownika</h1>
        {token && <button onClick={logout}>Wyloguj</button>}
        <Routes>
          <Route path="/" element={token ? <Home token={token} /> : <AuthPage setToken={setToken} />} />
          <Route path="/dashboard" element={token ? <ProductDashboard token={token} /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
