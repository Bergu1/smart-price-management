import React, { useState } from 'react';
import { login } from '../api';

const LoginForm = ({ setToken }) => {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form);
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
    } catch {
      alert('Błędne dane logowania');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Logowanie</h2>
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="password" type="password" placeholder="Hasło" onChange={handleChange} />
      <button type="submit">Zaloguj</button>
    </form>
  );
};

export default LoginForm;
