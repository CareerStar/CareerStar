import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const CustomerLogin = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const expectedPassword = process.env.REACT_APP_CUSTOMER_CUNY2X_PASSWORD || '';
  const expectedLogin = (process.env.REACT_APP_CUSTOMER_CUNY2X_LOGIN || 'customer');
  console.log('env pw present?', !!process.env.REACT_APP_CUSTOMER_CUNY2X_PASSWORD);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!expectedPassword) {
      setError('Login is not configured. Please set REACT_APP_CUSTOMER_CUNY2X_PASSWORD.');
      return;
    }

    if (login.trim().toLowerCase() !== expectedLogin.trim().toLowerCase()) {
      setError('Invalid login.');
      return;
    }

    if (password === expectedPassword) {
      localStorage.setItem('customer_cuny2x_token', 'true');
      navigate('/admin/customer/cuny2x/dashboard/cohortdashboard');
    } else {
      setError('Invalid password.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#200043' }}>
      <section className="stars-container" style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div id="stars"></div>
        <div id="stars2"></div>
        <div id="stars3"></div>
      </section>
      <div style={{ width: 360, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', padding: 24, borderRadius: 12, color: '#fff', boxShadow: '0 8px 30px rgba(0,0,0,0.4)', position: 'relative', zIndex: 1 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>Login as Customer</h1>
        <p style={{ fontSize: 13, color: '#c7c7e5', marginBottom: 16 }}>Enter login and password provided to you.</p>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input
              type="text"
              placeholder="Login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: '#fff' }}
            />
            <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '85%', padding: '10px 40px 10px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: '#fff' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', padding: 4, cursor: 'pointer' }}
            >
              {showPassword ? <EyeOff size={18} color="#ffffff" /> : <Eye size={18} color="#ffffff" />}
            </button>
            </div>
            {error && <div style={{ color: '#ff6b6b', fontSize: 12 }}>{error}</div>}
            <button type="submit" style={{ padding: '10px 12px', borderRadius: 8, background: 'linear-gradient(90deg, #8B5CF6, #EC4899)', color: '#fff', fontWeight: 700, border: '1px solid rgba(255,255,255,0.15)' }}>
              Log In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerLogin;


