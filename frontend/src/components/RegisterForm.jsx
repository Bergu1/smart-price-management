import React, { useState } from 'react';
import { register } from '../api';
import './RegisterForm.css';

const RegisterForm = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    is_employee: false,
  });

  const [verificationCode, setVerificationCode] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Skopiuj formularz i dodaj verification_code jeśli trzeba
    const payload = { ...form };
    if (form.is_employee) {
      payload.verification_code = verificationCode;
    }

    try {
      await register(payload);
      alert('Rejestracja udana!');
    } catch (err) {
      console.error('Rejestracja error:', err.response?.data || err.message);
      const detail =
        err.response?.data?.verification_code ||
        err.response?.data?.detail ||
        'Nieznany błąd.';
      alert('Błąd rejestracji: ' + detail);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Rejestracja</h2>
      <input
        name="email"
        placeholder="Email"
        onChange={handleChange}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Hasło"
        onChange={handleChange}
        required
      />
      <input
        name="name"
        placeholder="Imię"
        onChange={handleChange}
        required
      />
      <label>
        Pracownik?
        <input
          type="checkbox"
          name="is_employee"
          checked={form.is_employee}
          onChange={handleChange}
        />
      </label>

      {/* Pokazuj pole tylko jeśli zaznaczone is_employee */}
      {form.is_employee && (
        <div>
          <input
            type="text"
            placeholder="Kod pracownika"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
          />
        </div>
      )}

      <button type="submit">Zarejestruj</button>
    </form>
  );
};

export default RegisterForm;
