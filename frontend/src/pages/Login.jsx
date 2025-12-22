import React, { useState } from 'react';
import api from '../api/axios'; // Axios instance
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, LogIn } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { 
                username: username, 
                password: password 
            });

            if (res.data && res.data.id) {
                // 1. Store Data
                localStorage.setItem('userRole', res.data.role); 
                localStorage.setItem('userId', res.data.id);
                
                // 2. Alert & Navbar Update
                alert("Login Successful!");
                window.dispatchEvent(new Event("storage"));
                
                // 3. CRITICAL: Redirect Based on Role
                if (res.data.role === 'ADMIN') {
                    navigate('/admin/dashboard'); // Admin -> Dashboard
                } else {
                    navigate('/'); // User -> Home (Shop)
                }

            } else {
                alert("Invalid Username or Password!");
            }
        } catch (err) {
            console.error("Login Error:", err);
            alert("Login Failed. Please check backend connection.");
        }
    };

    return (
        <div className="flex justify-center items-center h-[70vh] bg-gray-50 mt-20">
            <div className="bg-white p-8 rounded-xl shadow-lg w-96 border border-gray-200">
                <div className="text-center mb-6">
                    <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                        <LogIn className="text-emerald-600" size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
                    <p className="text-gray-500 text-sm">Login to manage your account</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    {/* Username Input */}
                    <div className="relative">
                        <User className="absolute top-3 left-3 text-gray-400" size={20} />
                        <input 
                            type="text" 
                            placeholder="Username" 
                            className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div className="relative">
                        <Lock className="absolute top-3 left-3 text-gray-400" size={20} />
                        <input 
                            type="password" 
                            placeholder="Password" 
                            className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-bold hover:bg-emerald-700 transition shadow-md hover:shadow-lg">
                        Login
                    </button>
                </form>

                {/* Link to Register Page */}
                <div className="mt-6 text-center pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-emerald-600 font-bold hover:underline">
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;