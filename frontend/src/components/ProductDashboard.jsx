import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProductDashboard.css';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';

const ProductDashboard = ({ token, onLogout }) => {
  const [products, setProducts] = useState([]);
  const [editedProducts, setEditedProducts] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/products/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sorted = [...res.data].sort((a, b) => a.name_product.localeCompare(b.name_product));
      setProducts(sorted);
    } catch (err) {
      console.error("❌ Błąd przy pobieraniu produktów:", err);
    }
  };

  fetchProducts();
  const interval = setInterval(fetchProducts, 5000);
  return () => clearInterval(interval);
}, [token]);


  const handleChange = (e, id) => {
    const { name, value } = e.target;
    const original = products.find((p) => p.id === id);
  
    setEditedProducts((prev) => ({
      ...prev,
      [id]: {
        ...original,
        ...prev[id],
        [name]: value === 'null' ? '' : value,
      },
    }));
  };
  
  const handleSave = async (id) => {
    const updated = editedProducts[id];
    const formData = new FormData();
  
    for (const key in updated) {
      const value = updated[key];
  
      // Jeśli wartość to null, undefined lub pusty string – pomiń
      if (value === null || value === undefined || value === 'null') continue;

      if (key === 'product_image' && typeof value === 'string' && value.startsWith('http')) {
        continue;
      }
  
      formData.append(key, value);
    }
  
    try {
      await axios.put(`http://localhost:8000/api/products/${id}/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Zaktualizowano produkt');
      window.location.reload();
    } catch (err) {
      alert('Błąd podczas zapisu');
      console.error(err);
    }
  };

  const getAvailabilityStatus = (distance) => {
  if (distance < 120) {
    return { label: 'Dostępny', color: 'green' };
  } else if (distance >= 120 && distance < 150) {
    return { label: 'Lekki brak', color: 'orange' };
  } else {
    return { label: 'Brak', color: 'red' };
  }
};
  

  const handleDelete = async (id) => {
    if (!window.confirm('Czy na pewno chcesz usunąć ten produkt?')) return;
    try {
      await axios.delete(`http://localhost:8000/api/products/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Usunięto produkt');
      window.location.reload();
    } catch (err) {
      alert('Błąd podczas usuwania produktu');
      console.error(err);
    }
  };

  const handleGoToAddProduct = () => {
    navigate('/add-product');
  };

  const handleGoToDetails = (id) => {
    navigate(`/products/${id}`);
  };

  const filteredProducts = products.filter((p) =>
    p.name_product.toLowerCase().startsWith(searchQuery.toLowerCase())
  );

  return (
    <div className="panel">
      <h2>Panel produktów</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Szukaj po nazwie..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredProducts.length === 0 ? (
        <p>Brak produktów</p>
      ) : (
        <table>
         <thead>
            <tr>
              <th>Nazwa</th>
              <th>Kraj pochodzenia</th>
              <th>Cena</th>
              <th>Dostępność</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p.id}>
                <td data-label="Nazwa">
                  <input
                    name="name_product"
                    defaultValue={p.name_product}
                    onChange={(e) => handleChange(e, p.id)}
                  />
                </td>
                <td data-label="Kraj pochodzenia">
                  <input
                    name="product_country"
                    defaultValue={p.product_country}
                    onChange={(e) => handleChange(e, p.id)}
                  />
                </td>
                <td data-label="Cena">
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    defaultValue={p.price}
                    onChange={(e) => handleChange(e, p.id)}
                  />
                </td>
                <td data-label="Dostępność">
                  {p.distance != null ? (
                    <span style={{ color: getAvailabilityStatus(p.distance).color, fontWeight: 'bold' }}>
                      {getAvailabilityStatus(p.distance).label}
                    </span>
                  ) : '—'}
                </td>
                <td data-label="Akcje">
                  <button onClick={() => handleGoToDetails(p.id)}>Opis</button>{' '}
                  <button onClick={() => handleSave(p.id)}>Zapisz</button>{' '}
                  <button onClick={() => handleDelete(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <Trash2 size={18} color="red" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      )}

      <div className="add-product-wrapper">
        <button className="add-product-button" onClick={handleGoToAddProduct}>
          Dodaj nowy produkt
        </button>
      </div>

      <button className="logout-button" onClick={onLogout}>
        Wyloguj
      </button>
    </div>
  );
};

export default ProductDashboard;
