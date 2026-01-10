import { useState } from "react";
import { signup } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const submit = async () => {
    await signup(form);
    navigate("/login");
  };

  return (
    <>
      <h2>Signup</h2>
      <input placeholder="Username"
        onChange={e=>setForm({...form, username:e.target.value})}/>
      <input type="password" placeholder="Password"
        onChange={e=>setForm({...form, password:e.target.value})}/>
      <button onClick={submit}>Signup</button>
    </>
  );
}
