import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddProduct.css';

const AddProduct = ({ token }) => {
  const [form, setForm] = useState({
    name_product: '',
    product_country: '',
    price: '',
    product_description: '',
  });
  const [image, setImage] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (const key in form) {
      formData.append(key, form[key]);
    }
    if (image) {
      formData.append('product_image', image);
    }

    try {
      await axios.post('http://localhost:8000/api/products/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // Nie ustawiamy Content-Type, axios ustawi `multipart/form-data` z boundary
        },
      });
      alert('Produkt dodany!');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Błąd podczas dodawania produktu');
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="add-product-panel">
      <h2>Dodaj nowy produkt</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
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
        <textarea
          name="product_description"
          placeholder="Opis produktu (opcjonalny)"
          value={form.product_description}
          onChange={handleChange}
        />
        <input
          type="file"
          name="product_image"
          accept="image/*"
          onChange={handleImageChange}
        />
        <button type="submit">Dodaj produkt</button>
      </form>

      <div className="add-product-wrapper">
        <button className="add-product-button" onClick={handleGoBack}>
          Wróć do poprzedniej strony
        </button>
      </div>
    </div>
  );
};

export default AddProduct;
