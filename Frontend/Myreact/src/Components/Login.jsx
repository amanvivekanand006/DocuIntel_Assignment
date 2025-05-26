import React, { useState } from 'react';
import axios from 'axios';
import './Css/Login.css';
import { ToastContainer, toast } from 'react-toastify';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const LoginComponent = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();
      params.append('username', formData.email);
      params.append('password', formData.password);

      const response = await axiosInstance.post('/Login', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      console.log('Login success:', response.data);

      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('user_name', response.data.name);
      localStorage.setItem('user_id', response.data.user_id);
      localStorage.setItem('role', response.data.role);
      setFormData({
           email: '',
           password: '',
      })
      toast.success('Login successful!');
      navigate('/')
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      setError(err.response?.data?.detail || 'Login failed. Please try again.');
      toast.error('Login error:', err.response?.data || err.message)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        {/* Left Panel */}
        <div className="left-panel">
          <img
            src="https://images.unsplash.com/photo-1579546929662-711aa81148cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt="Background"
            className="background-image"
          />
          <div className="left-content">
            <h1>DocuIntel</h1>
            <p>Intelligent Document Insights Platform.</p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="right-panel">
          <h3>Access Your Portal</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}

            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default LoginComponent;
