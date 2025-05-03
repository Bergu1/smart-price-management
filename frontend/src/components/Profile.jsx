import React, { useEffect, useState } from 'react';
import { getProfile, updateProfile } from '../api';
import './Profile.css';


const Profile = ({ token }) => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', is_employee: false });

  useEffect(() => {
    const fetchData = async () => {
      const res = await getProfile(token);
      setUser(res.data);
      setForm(res.data);
    };
    fetchData();
  }, [token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(form, token);
    alert('Zapisano zmiany');
  };

  if (!user) return <p>Ładowanie...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Profil</h2>
      <input name="name" value={form.name} onChange={handleChange} />
      <input name="email" value={form.email} onChange={handleChange} />
      <label>
        Pracownik?
        <input type="checkbox" name="is_employee" checked={form.is_employee} onChange={handleChange} />
      </label>
      <button type="submit">Zapisz</button>
    </form>
  );
};

export default Profile;
