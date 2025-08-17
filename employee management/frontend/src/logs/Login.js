import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css';
import React, { useEffect, useState } from 'react';

export default function Login({ setIsLoggedIn, setLoggedUser }) {
  useEffect(() => {
    document.title = 'Employee Management';
  }, []);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    // Step 1: fetch all employees from API
    const employeesRes = await axios.get('http://127.0.0.1:8000/api/employee/');
    const employees = employeesRes.data;

    // Step 2: verify credentials locally against Employee data
    const user = employees.find(
      emp =>
        emp.email?.toLowerCase().trim() === email.toLowerCase().trim() &&
        emp.password === password.trim()
    );

    if (!user) {
      alert('Invalid email or password');
      return;
    }

    // Step 3: if verified, call backend login API to create session
    const loginRes = await axios.post(
      'http://127.0.0.1:8000/api/accounts/login/',
      { email },
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      }
    );

    console.log('Sending login POST:', email, password);

    // Step 4: set login state & navigate
    setIsLoggedIn(true);
    setLoggedUser(loginRes.data);
    navigate('/');
  } catch (error) {
    alert('Login failed. Please try again.');
    console.error('Login error:', error);
  }
};


  return (
    <div className="flex">
      <div className="image">
        <img src="./login.jpg" alt="Logo" />
      </div>
      <div className="flex">
        <form className="login-form" onSubmit={handleLogin}>
          <h2 id="login">Login</h2>
          <input
            type="email"
            className="email-input"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="password-input"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit" id="button">Login</button>
        </form>
      </div>
    </div>
  );
}
