// Updated ProductDashboard.jsx with centered layout and single logout button
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProductDashboard.css';

const ProductDashboard = ({ token, onLogout }) => {
  const [products, setProducts] = useState([]);
  const [editedProducts, setEditedProducts] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await axios.get('http://localhost:8000/api/products/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sorted = [...res.data].sort((a, b) => a.name_product.localeCompare(b.name_product));
      setProducts(sorted);
    };
    fetchProducts();
  }, [token]);

  const handleChange = (e, id) => {
    const { name, value } = e.target;
    setEditedProducts((prev) => ({
      ...prev,
      [id]: {
        ...products.find((p) => p.id === id),
        ...prev[id],
        [name]: value,
      },
    }));
  };

  const handleSave = async (id) => {
    const updated = editedProducts[id];
    try {
      await axios.put(`http://localhost:8000/api/products/${id}/`, updated, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Zaktualizowano produkt');
      window.location.reload();
    } catch (err) {
      alert('Błąd podczas zapisu');
      console.error(err);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name_product.toLowerCase().startsWith(searchQuery.toLowerCase())
  );

  const handleGoToAddProduct = () => {
    window.location.href = '/add-product';
  };

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
              <th>Akcja</th>
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
                <td data-label="Akcja">
                  <button onClick={() => handleSave(p.id)}>Zapisz</button>
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

      <button className="logout-button" onClick={onLogout}>Wyloguj</button>
    </div>
  );
};

export default ProductDashboard;
