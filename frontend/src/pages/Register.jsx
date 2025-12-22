import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Lock, User, Shield } from 'lucide-react';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('USER'); // Default Role 'USER'
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            // Role bhi backend bhejo
            const res = await api.post('/auth/register', { 
                username, 
                password, 
                role 
            });
            
            if (res.data === "User registered successfully!") {
                alert("Registration Successful! Please Login.");
                navigate('/login');
            } else {
                alert(res.data);
            }
        } catch (err) {
            console.error(err);
            alert("Registration Failed");
        }
    };

    return (
        <div className="flex justify-center items-center h-[80vh] bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-96 border border-gray-200">
                <div className="text-center mb-6">
                    <UserPlus className="mx-auto text-emerald-600 mb-2" size={40} />
                    <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
                </div>
                
                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="relative">
                        <User className="absolute top-3 left-3 text-gray-400" size={20} />
                        <input 
                            type="text" 
                            placeholder="Choose Username" 
                            className="w-full pl-10 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="relative">
                        <Lock className="absolute top-3 left-3 text-gray-400" size={20} />
                        <input 
                            type="password" 
                            placeholder="Choose Password" 
                            className="w-full pl-10 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* ROLE SELECTION DROPDOWN */}
                    <div className="relative">
                        <Shield className="absolute top-3 left-3 text-gray-400" size={20} />
                        <select 
                            className="w-full pl-10 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="USER">Customer (User)</option>
                            <option value="ADMIN">Admin (Shop Owner)</option>
                        </select>
                    </div>

                    <button type="submit" className="w-full bg-emerald-600 text-white py-2 rounded font-bold hover:bg-emerald-700 transition">
                        Register
                    </button>
                </form>
                
                <div className="mt-4 text-center text-sm">
                    Already have an account? <Link to="/login" className="text-emerald-600 font-bold">Login here</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;