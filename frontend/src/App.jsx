import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AddProduct from './pages/AddProduct';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart'; // Import Cart

import AdminDashboard from './pages/AdminDashboard'; // Import Dashboard

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          
          {/* Admin Routes */}
          <Route path="/admin/add" element={<AddProduct />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} /> {/* NEW */}
        </Routes>
      </div>
    </div>
  );
}
export default App;