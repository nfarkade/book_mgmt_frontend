import { useState } from "react";
import PropTypes from 'prop-types';
import { signup } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";
import { handleApiError } from "../utils/errorHandler";

export default function Signup() {
  const [form, setForm] = useState({ username: '', password: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    
    if (!form.username || !form.password) {
      setError('Username and password are required');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await signup(form);
      navigate("/login");
    } catch (error) {
      const message = handleApiError(error);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{maxWidth: '400px', margin: '50px auto'}}>
        <h2>Signup</h2>
        
        {error && (
          <div style={{
            padding: '10px',
            background: '#f8d7da',
            color: '#721c24',
            borderRadius: '4px',
            marginBottom: '15px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={submit}>
          <div className="form-group">
            <input 
              className="form-control"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <input 
              type="email" 
              className="form-control"
              name="email"
              placeholder="Email (optional)"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <input 
              type="password" 
              className="form-control"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              disabled={loading}
            />
          </div>
          <button 
            type="submit"
            className="btn btn-primary" 
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Signup'}
          </button>
        </form>

        <p style={{ marginTop: '15px', textAlign: 'center' }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
