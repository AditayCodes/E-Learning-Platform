import { useState } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const navigate = useNavigate();

  const handleSignup = async e => {
    e.preventDefault();
    try{
      await API.post('/auth/signup',{name,email,password});
      alert('Signup successful! Please login.');
      navigate('/login');
    }catch(err){
      alert('Signup failed: '+(err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light p-3">
      <div className="card shadow-sm w-100" style={{maxWidth:'400px'}}>
        <div className="card-body">
          <h3 className="card-title text-center mb-4">Signup</h3>
          <form onSubmit={handleSignup} className="d-flex flex-column gap-3">
            <input type="text" className="form-control" placeholder="Full Name" value={name} onChange={e=>setName(e.target.value)} required />
            <input type="email" className="form-control" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
            <input type="password" className="form-control" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
            <button type="submit" className="btn btn-primary w-100 shadow-sm"
                    style={{transition:"transform 0.2s"}}
                    onMouseEnter={e=>e.currentTarget.style.transform="scale(1.05)"}
                    onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
              Signup
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
