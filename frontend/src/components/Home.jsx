import React, { useEffect, useState } from 'react';
import { getProfile } from '../api';
import axios from 'axios';
import './Home.css';
import { useNavigate } from 'react-router-dom';

const Home = ({ token, onLogout }) => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getProfile(token);
        setUser(res.data);
      } catch (err) {
        console.error('❌ Błąd pobierania użytkownika:', err);
      }
    };

    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/products/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(res.data);
      } catch (err) {
        console.error('❌ Błąd pobierania produktów:', err);
      }
    };

    fetchUser();
    fetchProducts();

    const interval = setInterval(fetchProducts, 5000);

    return () => clearInterval(interval); 
  }, [token]);


  const getAvailabilityStatus = (distance) => {
    if (distance < 120) {
      return { label: 'Dostępny', color: 'green' };
    } else if (distance >= 120 && distance < 150) {
      return { label: 'Lekki brak', color: 'orange' };
    } else {
      return { label: 'Brak', color: 'red' };
    }
  };

  if (!user) return <p>Ładowanie...</p>;

  return (
    <div>
      <h2>Witamy, {user.name}!</h2>

      <button onClick={onLogout} className="logout-button">
        Wyloguj
      </button>

      {user.is_employee && (
        <button onClick={() => navigate('/dashboard')} className="go-to-panel-button">
          Przejdź do panelu pracownika
        </button>
      )}

      <div className="product-grid">
        {products.map((product) => {
          const status = getAvailabilityStatus(product.distance);
          return (
            <div
              key={product.id}
              className="product-card"
              onClick={() => navigate(`/products/${product.id}`)}
              style={{ cursor: 'pointer' }}
            >
              {product.product_image && (
                <img
                  src={product.product_image}
                  alt={product.name_product}
                  className="product-image"
                />
              )}
              <h3>{product.name_product}</h3>
              <p>
                <strong>Kraj:</strong> {product.product_country}
              </p>
              <p>
                <strong>Cena:</strong> {product.price} zł
              </p>
              <p>
                <strong>Dostępność: </strong>
                <span style={{ color: status.color, fontWeight: 'bold' }}>
                  {status.label}
                </span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
