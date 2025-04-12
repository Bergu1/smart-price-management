import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductDashboard = ({ token }) => {
  console.log("TOKEN:", token);
  const [products, setProducts] = useState([]);
  const [editedProducts, setEditedProducts] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await axios.get('http://localhost:8000/api/products/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
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
    console.log("Wysyłane dane:", updated); // ← dodaj to
  
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
  

  return (
    <div>
      <h2>Panel produktów</h2>
      {products.length === 0 ? (
        <p>Brak produktów</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nazwa</th>
              <th>Ilość</th>
              <th>Termin ważności</th>
              <th>Cena</th>
              <th>Akcja</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>
                  <input
                    name="name_product"
                    defaultValue={p.name_product}
                    onChange={(e) => handleChange(e, p.id)}
                  />
                </td>
                <td>
                  <input
                    name="quantity_available"
                    type="number"
                    defaultValue={p.quantity_available}
                    onChange={(e) => handleChange(e, p.id)}
                  />
                </td>
                <td>
                  <input
                    name="expiry_date"
                    type="date"
                    defaultValue={p.expiry_date}
                    onChange={(e) => handleChange(e, p.id)}
                  />
                </td>
                <td>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    defaultValue={p.price}
                    onChange={(e) => handleChange(e, p.id)}
                  />
                </td>
                <td>
                  <button onClick={() => handleSave(p.id)}>Zapisz</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductDashboard;
