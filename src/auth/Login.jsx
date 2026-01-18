import { useState } from "react";
import PropTypes from 'prop-types';
import { login } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";
import { handleApiError } from "../utils/errorHandler";

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
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

    setLoading(true);
    setError(null);

    try {
      const response = await login(form);
      // Store user data if provided
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      navigate("/books");
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
        <h2>Login</h2>
        
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
              autoComplete="username"
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
              disabled={loading}
              autoComplete="current-password"
            />
          </div>
          <button 
            type="submit"
            className="btn btn-primary" 
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={{ marginTop: '15px', textAlign: 'center' }}>
          Dont have an account? <Link to="/signup">Signup</Link>
        </p>
      </div>
    </div>
  );
}
