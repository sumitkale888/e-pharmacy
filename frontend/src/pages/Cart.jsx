import React, { useEffect, useState } from 'react';
import api, { IMAGE_BASE_URL } from '../api/axios';
import { Trash2, ShoppingBag, MinusCircle, PlusCircle, ArrowLeft, CreditCard } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (!userId) {
            navigate('/login');
            return;
        }
        fetchCart();
    }, [userId, navigate]);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/cart/${userId}`);
            setCartItems(res.data);
        } catch (error) {
            console.error("Error fetching cart", error);
        } finally {
            setLoading(false);
        }
    };

    const removeFromCart = async (itemId) => {
        try {
            await api.delete(`/cart/remove/${itemId}`);
            // Optimistic UI update: filter out the item immediately
            setCartItems(prev => prev.filter(item => item.id !== itemId));
        } catch (error) {
            console.error("Error removing item", error);
        }
    };

    // Logic for Subtotal
    const subtotal = cartItems.reduce((acc, item) => acc + (item.medicine.price * item.quantity), 0);
    const deliveryCharge = subtotal > 500 || subtotal === 0 ? 0 : 40;
    const totalAmount = subtotal + deliveryCharge;

    return (
        <div className="bg-[#fcfdfd] min-h-screen pb-20 pt-20 md:pt-23">
            <div className="container mx-auto p-4 md:p-8 max-w-6xl">
                
                {/* Header with Back Button */}
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-full shadow-sm border border-gray-100 transition-all">
                        <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <h2 className="text-3xl font-extrabold text-gray-800 flex items-center gap-3">
                        <ShoppingBag className="text-emerald-600" size={32} /> 
                        Shopping Cart <span className="text-lg font-medium text-gray-400">({cartItems.length} items)</span>
                    </h2>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                    </div>
                ) : cartItems.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-dashed border-gray-200">
                        <div className="bg-emerald-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag size={48} className="text-emerald-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">Your cart is empty</h3>
                        <p className="text-gray-500 mt-2 mb-8">Looks like you haven't added any medicines yet.</p>
                        <Link to="/" className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-100">
                            Browse Medicines
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* LEFT: Items List */}
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => (
                                <div key={item.id} className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6 hover:shadow-md transition-shadow group">
                                    {/* Product Image */}
                                    <div className="w-24 h-24 bg-gray-50 rounded-xl flex items-center justify-center p-2 flex-shrink-0">
                                        <img 
                                            src={`${IMAGE_BASE_URL}${item.medicine.imageName}`} 
                                            alt={item.medicine.name}
                                            className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
                                            onError={(e) => e.target.src = "https://via.placeholder.com/100?text=Medicine"}
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-grow text-center md:text-left">
                                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider">
                                            {item.medicine.category}
                                        </span>
                                        <h4 className="text-lg font-bold text-gray-800 mt-1">{item.medicine.name}</h4>
                                        <p className="text-sm text-gray-400">Unit Price: ₹{item.medicine.price}</p>
                                    </div>

                                    {/* Action Price & Delete */}
                                    <div className="flex items-center gap-8 w-full md:w-auto justify-between border-t md:border-t-0 pt-4 md:pt-0">
                                        <div className="text-center md:text-right">
                                            <p className="text-xs text-gray-400 font-medium">Subtotal</p>
                                            <p className="text-xl font-black text-gray-900">₹{item.medicine.price * item.quantity}</p>
                                        </div>
                                        <button 
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-gray-300 hover:text-red-500 p-2.5 rounded-xl hover:bg-red-50 transition-all">
                                            <Trash2 size={22} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* RIGHT: Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-50 sticky top-24">
                                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    Order Summary
                                </h3>
                                
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-gray-500">
                                        <span>Items Subtotal</span>
                                        <span className="font-semibold text-gray-800">₹{subtotal}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500">
                                        <span>Delivery Fee</span>
                                        <span className={deliveryCharge === 0 ? "text-emerald-500 font-bold" : "text-gray-800 font-semibold"}>
                                            {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
                                        </span>
                                    </div>
                                    {subtotal < 500 && (
                                        <div className="bg-blue-50 p-3 rounded-lg text-[11px] text-blue-600 leading-relaxed border border-blue-100">
                                            Add ₹{500 - subtotal} more to your cart for <b>FREE Delivery</b>!
                                        </div>
                                    )}
                                    <hr className="border-gray-100" />
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-lg font-bold text-gray-800">Total Amount</span>
                                        <span className="text-2xl font-black text-emerald-600">₹{totalAmount}</span>
                                    </div>
                                </div>

                                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-3 active:scale-95">
                                    <CreditCard size={20} />
                                    Proceed to Checkout
                                </button>
                                
                                <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-widest font-bold">
                                    Safe & Secure Payments
                                </p>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;