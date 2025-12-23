import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Pill, LogIn, PlusSquare, Home as HomeIcon, ShoppingCart, LayoutDashboard, LogOut, User } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [role, setRole] = useState(localStorage.getItem('userRole'));
    const [scrolled, setScrolled] = useState(false);

    // Sync role state and handle scroll effect
    useEffect(() => {
        const handleStorageChange = () => {
            setRole(localStorage.getItem('userRole'));
        };

        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('scroll', handleScroll);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

   const handleLogout = () => {
        localStorage.removeItem('token'); // Token Delete
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        
        setRole(null);
        window.dispatchEvent(new Event("storage"));
        navigate('/');
    };

    // Helper to check active route
    const isActive = (path) => location.pathname === path;

    const navLinkClass = (path) => `
        flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-200
        ${isActive(path) 
            ? 'bg-emerald-700 text-white shadow-inner' 
            : 'hover:bg-emerald-500/50 text-emerald-50 hover:text-white'}
    `;

    return (
        <nav className={`fixed top-0 w-full z-[100] transition-all duration-300 ${
            scrolled ? 'bg-emerald-700 shadow-xl py-3' : 'bg-emerald-600 py-4'
        }`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                
                {/* Logo Section */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="bg-white p-1.5 rounded-xl group-hover:rotate-12 transition-transform duration-300">
                        <Pill size={24} className="text-emerald-600" />
                    </div>
                    <span className="text-2xl font-black tracking-tight text-white">
                        Medi<span className="text-emerald-200">Care+</span>
                    </span>
                </Link>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center gap-3">
                    
                    <Link to="/" className={navLinkClass('/')}>
                        <HomeIcon size={18} /> <span>Home</span>
                    </Link>

                    {role === 'ADMIN' ? (
                        <>
                            <Link to="/admin/dashboard" className={navLinkClass('/admin/dashboard')}>
                                <LayoutDashboard size={18} /> <span>Dashboard</span>
                            </Link>
                            <Link to="/admin/add" className={navLinkClass('/admin/add')}>
                                <PlusSquare size={18} /> <span>Add Product</span>
                            </Link>
                        </>
                    ) : (
                        <Link to="/cart" className={navLinkClass('/cart')}>
                            <div className="relative">
                                <ShoppingCart size={18} />
                                {/* Optional: Add a dot if items exist */}
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 rounded-full border border-emerald-600"></span>
                            </div>
                            <span>My Cart</span>
                        </Link>
                    )}

                    {/* Divider */}
                    <div className="h-6 w-[1px] bg-emerald-500 mx-2"></div>

                    {role ? (
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-800/50 rounded-full border border-emerald-500/30">
                                <User size={16} className="text-emerald-200" />
                                <span className="text-xs font-bold uppercase tracking-wider">{role}</span>
                            </div>
                            <button 
                                onClick={handleLogout} 
                                className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-rose-900/20 transition-all active:scale-95"
                            >
                                <LogOut size={16} /> Logout
                            </button>
                        </div>
                    ) : (
                        <Link 
                            to="/login" 
                            className="flex items-center gap-2 bg-white text-emerald-700 px-6 py-2 rounded-xl font-bold hover:bg-emerald-50 hover:shadow-lg transition-all active:scale-95"
                        >
                            <LogIn size={18} /> Login
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Icon (Placeholder for functionality) */}
                <div className="md:hidden">
                    <button className="text-white p-2">
                        <div className="w-6 h-0.5 bg-white mb-1.5"></div>
                        <div className="w-6 h-0.5 bg-white mb-1.5"></div>
                        <div className="w-6 h-0.5 bg-white"></div>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;