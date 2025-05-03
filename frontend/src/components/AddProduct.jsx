// AddProduct.jsx - Formularz dodawania nowego produktu
import React, { useState } from 'react';
import axios from 'axios';
import './AddProduct.css';

const AddProduct = ({ token }) => {
  const [form, setForm] = useState({
    name_product: '',
    product_country: '',
    price: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/products/', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Produkt dodany!');
      window.location.href = '/dashboard';
    } catch (err) {
      console.error(err);
      alert('Błąd podczas dodawania produktu');
    }
  };

  return (
    <div className="add-product-panel">
      <h2>Dodaj nowy produkt</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name_product"
          placeholder="Nazwa produktu"
          value={form.name_product}
          onChange={handleChange}
          required
        />
        <input
          name="product_country"
          placeholder="Kraj pochodzenia"
          value={form.product_country}
          onChange={handleChange}
          required
        />
        <input
          name="price"
          type="number"
          step="0.01"
          placeholder="Cena"
          value={form.price}
          onChange={handleChange}
          required
        />
        <button type="submit">Dodaj produkt</button>
      </form>
    </div>
  );
};

export default AddProduct;
