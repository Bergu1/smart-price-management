import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import AuthPage from './components/AuthPage';
import Home from './components/Home';
import ProductDashboard from './components/ProductDashboard';
import AddProduct from './components/AddProduct';
import ProductDetails from './components/ProductDetails';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <Router>
      <div>
        <h1
          style={{
            textAlign: 'center',
            fontSize: '2rem',
            color: '#1976d2',
            margin: '2rem 0',
            fontFamily: 'Segoe UI, sans-serif',
            letterSpacing: '1px',
          }}
        >
          Razem tworzymy przyszłość!
        </h1>

        <Routes>
          {/* Strona główna */}
          <Route
            path="/"
            element={
              token ? (
                <Home token={token} onLogout={handleLogout} />
              ) : (
                <AuthPage setToken={setToken} />
              )
            }
          />

          {/* Panel pracownika */}
          <Route
            path="/dashboard"
            element={
              token ? (
                <ProductDashboard token={token} onLogout={handleLogout} />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          {/* Dodawanie produktu */}
          <Route
            path="/add-product"
            element={
              token ? (
                <AddProduct token={token} onLogout={handleLogout} />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          {/* Szczegóły produktu */}
          <Route
            path="/products/:id"
            element={
              token ? (
                <ProductDetails token={token} onLogout={handleLogout} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
