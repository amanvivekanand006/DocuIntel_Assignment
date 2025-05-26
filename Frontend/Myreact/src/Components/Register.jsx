import React, { useState } from 'react';
import axios from 'axios'; 
import './Css/Register.css';
import { ToastContainer, toast } from 'react-toastify';
import axiosInstance from '../api/axiosInstance';

const RegisterComponent = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    password: '',
    confirm_password: '',
    terms: false,
  });
  
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      alert("Passwords do not match!");
      return;
    }

    if (!formData.terms) {
      alert("You must agree to the terms!");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone_number: parseInt(formData.phone_number, 10),
        password: formData.password,
        confirm_password: formData.confirm_password,
      };

      const response = await axiosInstance.post('/Create_user', payload);
      toast.success("Registration successful!");

      console.log("Response:", response.data);
      setFormData({
      name: '',
      email: '',
      phone_number: '',
      password: '',
      confirm_password: '',
      terms: false,
      });
      // Optionally, clear form or redirect user
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message);
      toast.error("Registration failed: " + (error.response?.data?.detail || error.message));
    }

    setLoading(false);
  };
  return (
    <div className="login-wrapper register-wrapper">
      <div className="login-container register-container">
        <div className="left-panel">
          <div className="left-content">
            <h1>Join Our Network</h1>
            <p>Analyze, extract, and understand your documents smarter and faster with AI.</p>
          </div>
        </div>

        <div className="right-panel">
          <h3>Create Your Account</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="fullname">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone_number">Phone Number</label>
              <input
                type="text"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number || ''}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirm_password">Confirm Password</label>
              <input
                type="password"
                id="confirm_password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
                required
              />
              <label htmlFor="terms" className="checkbox-label">
                I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
              </label>
            </div>

            <button type="submit">Create Account</button>
          </form>

          <div className="login-redirect">
            <p>
              Already have an account? <a href="/login">Sign in</a>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default RegisterComponent;
