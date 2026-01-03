import { useState } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/signup', form);
      alert('Signup successful ✅');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded">
      <h2 className="text-2xl mb-4 text-center">Signup</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="border p-2 rounded" />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="border p-2 rounded" />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="border p-2 rounded" />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Signup</button>
      </form>
    </div>
  );
}
