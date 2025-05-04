import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProductDetails.css';

const ProductDetails = ({ token }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/products/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProduct(res.data);
      } catch (err) {
        console.error('Błąd podczas pobierania produktu', err);
      }
    };

    fetchProduct();
  }, [id, token]);

  if (!product) return <p>Ładowanie danych produktu...</p>;

  return (
    <div className="product-details">
      <h2>{product.name_product}</h2>
      <p><strong>Kraj pochodzenia:</strong> {product.product_country}</p>
      <p><strong>Cena:</strong> {product.price} zł</p>
      {product.product_description && (
        <p><strong>Opis:</strong> {product.product_description}</p>
      )}
      {product.product_image_url && (
        <div className="product-image">
          <img src={product.product_image_url} alt={product.name_product} />
        </div>
      )}
      <button onClick={() => navigate(-1)}>← Powrót</button>
    </div>
  );
};

export default ProductDetails;
