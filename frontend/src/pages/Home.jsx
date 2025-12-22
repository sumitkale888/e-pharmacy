import React, { useEffect, useState } from 'react';
import api, { IMAGE_BASE_URL } from '../api/axios';
import { ShoppingCart, Search, AlertCircle, Pill, Activity, ShieldCheck, Sparkles } from 'lucide-react';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await api.get('/medicines/all');
            setProducts(res.data);
        } catch (err) {
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (medicineId) => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            alert("Please Login first!");
            return;
        }
        try {
            await api.post('/cart/add', null, {
                params: { userId, medicineId, quantity: 1 }
            });
            alert("✨ Added to your health kit!");
        } catch (error) {
            alert("Failed to add to cart.");
        }
    };

    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-[#f0f4f8] min-h-screen pb-20 font-sans selection:bg-emerald-100 selection:text-emerald-900">
            {/* --- VIBRANT HERO SECTION --- */}
            <div className="relative bg-gradient-to-br from-indigo-900 via-emerald-800 to-teal-900 py-20 px-4 overflow-hidden shadow-2xl">
                {/* Animated soft blobs for a premium look */}
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-emerald-400/20 rounded-full blur-[100px]"></div>

                <div className="container mx-auto max-w-5xl text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl px-5 py-2 rounded-full text-indigo-100 text-xs font-bold mb-8 border border-white/20 tracking-widest uppercase shadow-sm">
                        <Sparkles size={14} className="text-yellow-300" /> Quality Assured Healthcare
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-black mb-6 text-white tracking-tight leading-tight">
                        Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300">Wellness</span> Today
                    </h1>
                    
                    <p className="mb-10 text-indigo-50/80 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                        Your one-stop destination for genuine medicines and healthcare essentials.
                    </p>
                    
                    <div className="relative max-w-2xl mx-auto group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-indigo-500 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>
                        <div className="relative flex items-center">
                            <Search className="absolute left-5 text-emerald-600 transition-transform group-hover:scale-110" size={24} />
                            <input 
                                type="text" 
                                placeholder="Search for insulin, paracetamol, or vitamins..." 
                                className="w-full pl-14 pr-6 py-5 rounded-2xl text-gray-800 shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white/95 backdrop-blur-sm text-lg"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MAIN CONTENT --- */}
            <div className="container mx-auto px-4 max-w-7xl -mt-10 relative z-20">
                
                {/* Quick Info - Colorful Glass Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white flex items-center gap-5 hover:translate-y-[-5px] transition-all">
                        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-4 rounded-2xl text-white shadow-lg shadow-indigo-200"><Pill size={28}/></div>
                        <div><h4 className="font-extrabold text-gray-800">100% Genuine</h4><p className="text-xs text-gray-500 font-medium tracking-wide">Direct from manufacturers</p></div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white flex items-center gap-5 hover:translate-y-[-5px] transition-all">
                        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 rounded-2xl text-white shadow-lg shadow-emerald-200"><Activity size={28}/></div>
                        <div><h4 className="font-extrabold text-gray-800">Health First</h4><p className="text-xs text-gray-500 font-medium tracking-wide">Pharmacist approved</p></div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white flex items-center gap-5 hover:translate-y-[-5px] transition-all">
                        <div className="bg-gradient-to-br from-rose-500 to-rose-600 p-4 rounded-2xl text-white shadow-lg shadow-rose-200"><ShoppingCart size={28}/></div>
                        <div><h4 className="font-extrabold text-gray-800">Quick Ship</h4><p className="text-xs text-gray-500 font-medium tracking-wide">Express home delivery</p></div>
                    </div>
                </div>

                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                             <Pill size={20} />
                        </div>
                        <h2 className="text-3xl font-black text-gray-800 tracking-tight">Available Stock</h2>
                    </div>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100 uppercase">
                        {filteredProducts.length} results
                    </span>
                </div>

                {/* --- PRODUCT GRID --- */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map(n => (
                            <div key={n} className="h-96 bg-white animate-pulse rounded-3xl border border-gray-100 shadow-sm"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {filteredProducts.map((item) => (
                            <div key={item.id} className="group bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-indigo-200/50 transition-all duration-500 flex flex-col h-full overflow-hidden border border-gray-100 hover:border-indigo-100 relative">
                                
                               <div className="relative w-full aspect-square bg-gray-50 rounded-t-[2rem] overflow-hidden flex items-center justify-center p-6 group">
    {/* Low Stock Badge */}
    {item.stock < 10 && (
        <div className="absolute top-4 left-4 z-20 bg-rose-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">
            LIMITED
        </div>
    )}

    {/* --- THE FIX: Fixed box with padding --- */}
    <img 
        src={`${IMAGE_BASE_URL}${item.imageName}`} 
        alt={item.name}
        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
        /* 1. aspect-square: Makes the container a perfect square.
           2. p-6: Forces a gap between the image and the container edge.
           3. object-contain: Fits the whole image inside the box without cropping.
        */
        onError={(e) => {
            e.target.src = "https://via.placeholder.com/300?text=Medicine";
        }} 
    />
    
    {/* Subtle bottom shadow inside the container for depth */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
</div>

                                {/* Content Section */}
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="mb-4">
                                        <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-tighter mb-3 inline-block">
                                            {item.category || 'Medicine'}
                                        </span>
                                        <h3 className="text-xl font-extrabold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1 leading-tight">
                                            {item.name}
                                        </h3>
                                        <p className="text-sm text-gray-400 mt-2 line-clamp-2 leading-relaxed font-medium">
                                            {item.description || "Certified pharmaceutical product for your healthcare needs."}
                                        </p>
                                    </div>
                                    
                                    <div className="mt-auto pt-5 flex items-center justify-between border-t border-gray-50">
                                        <div>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Price</p>
                                            <span className="text-3xl font-black text-gray-900 tracking-tighter">₹{item.price}</span>
                                        </div>
                                        
                                        <button 
                                            onClick={() => addToCart(item.id)}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-2xl shadow-xl shadow-indigo-100 group-hover:scale-110 transition-all active:scale-95 flex items-center justify-center"
                                        >
                                            <ShoppingCart size={22} strokeWidth={2.5} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;