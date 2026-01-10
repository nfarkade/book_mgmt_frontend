import { useState } from "react";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const submit = async () => {
    try {
      await login(form);
      navigate("/books");
    } catch (error) {
      console.error('Login failed:', error);
      alert(error.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="container">
      <div className="card" style={{maxWidth: '400px', margin: '50px auto'}}>
        <h2>Login</h2>
        <div className="form-group">
          <input 
            className="form-control"
            placeholder="Username"
            onChange={(e)=>setForm({...form, username:e.target.value})}
          />
        </div>
        <div className="form-group">
          <input 
            type="password" 
            className="form-control"
            placeholder="Password"
            onChange={(e)=>setForm({...form, password:e.target.value})}
          />
        </div>
        <button className="btn btn-primary" onClick={submit}>Login</button>
      </div>
    </div>
  );
}
