import React, { useState } from 'react';
import { register } from '../api';

const RegisterForm = () => {
  const [form, setForm] = useState({ email: '', password: '', name: '', is_employee: false });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      alert('Rejestracja udana!');
    } catch (err) {
      console.error('Rejestracja error:', err.response?.data || err.message);
      alert('Błąd rejestracji: ' + (err.response?.data?.detail || ''));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Rejestracja</h2>
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="password" type="password" placeholder="Hasło" onChange={handleChange} />
      <input name="name" placeholder="Imię" onChange={handleChange} />
      <label>
        Pracownik?
        <input type="checkbox" name="is_employee" onChange={handleChange} />
      </label>
      <button type="submit">Zarejestruj</button>
    </form>
  );
};

export default RegisterForm;
