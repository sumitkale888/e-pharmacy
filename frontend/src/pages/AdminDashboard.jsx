import React, { useEffect, useState } from 'react';
import api, { IMAGE_BASE_URL } from '../api/axios';
import { Trash2, Edit, PlusCircle, X, Save, Package, AlertTriangle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // --- EDIT STATE ---
    const [editingProduct, setEditingProduct] = useState(null);
    const [editImage, setEditImage] = useState(null);

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

    const handleDelete = async (id) => {
        if (window.confirm("🗑️ Are you sure? This action cannot be undone.")) {
            try {
                await api.delete(`/medicines/delete/${id}`);
                fetchProducts();
            } catch (error) {
                alert("Failed to delete.");
            }
        }
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setEditImage(null);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', editingProduct.name);
        formData.append('category', editingProduct.category);
        formData.append('price', editingProduct.price);
        formData.append('stock', editingProduct.stock);
        formData.append('description', editingProduct.description);
        
        if (editImage) {
            formData.append('image', editImage);
        }

        try {
            await api.put(`/medicines/update/${editingProduct.id}`, formData);
            setEditingProduct(null);
            fetchProducts();
        } catch (error) {
            console.error("Update failed", error);
            alert("Update Failed");
        }
    };

    return (
        <div className="bg-[#fcfdfd] min-h-screen pb-20 pt-24 md:pt-28">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Inventory Management</h2>
                        <p className="text-gray-500 text-sm mt-1">Manage your medicine stock and product details</p>
                    </div>
                    <Link to="/admin/add" className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-emerald-200 active:scale-95">
                        <PlusCircle size={20} /> Add New Medicine
                    </Link>
                </div>

                {/* Statistics Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="bg-blue-100 p-3 rounded-xl text-blue-600"><Package /></div>
                        <div><p className="text-xs text-gray-500 uppercase font-bold">Total Items</p><p className="text-2xl font-black">{products.length}</p></div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="bg-orange-100 p-3 rounded-xl text-orange-600"><AlertTriangle /></div>
                        <div><p className="text-xs text-gray-500 uppercase font-bold">Low Stock</p><p className="text-2xl font-black">{products.filter(p => p.stock < 10).length}</p></div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600"><CheckCircle /></div>
                        <div><p className="text-xs text-gray-500 uppercase font-bold">In Stock</p><p className="text-2xl font-black">{products.filter(p => p.stock >= 10).length}</p></div>
                    </div>
                </div>

                {/* TABLE SECTION */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Product</th>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Price</th>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Stock Status</th>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr><td colSpan="5" className="p-10 text-center text-gray-400 animate-pulse">Loading Inventory...</td></tr>
                                ) : products.map((item) => (
                                    <tr key={item.id} className="hover:bg-emerald-50/30 transition-colors group">
                                        <td className="p-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                                                    <img 
                                                        src={`${IMAGE_BASE_URL}${item.imageName}`} 
                                                        alt={item.name} 
                                                        className="w-full h-full object-contain p-1"
                                                        onError={(e) => e.target.src = "https://via.placeholder.com/100?text=Medicine"}
                                                    />
                                                </div>
                                                <span className="font-bold text-gray-800 group-hover:text-emerald-700">{item.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">{item.category}</span>
                                        </td>
                                        <td className="p-5 font-black text-gray-900">₹{item.price}</td>
                                        <td className="p-5">
                                            <div className="flex flex-col">
                                                <span className={`text-sm font-bold ${item.stock < 10 ? 'text-red-500' : 'text-emerald-600'}`}>
                                                    {item.stock} Units
                                                </span>
                                                <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                                                    <div 
                                                        className={`h-full rounded-full ${item.stock < 10 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                                                        style={{ width: `${Math.min(item.stock, 100)}%` }}>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex justify-center gap-2">
                                                <button 
                                                    onClick={() => handleEditClick(item)}
                                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                    title="Edit Product"
                                                >
                                                    <Edit size={20} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                    title="Delete Product"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* --- ENHANCED EDIT MODAL --- */}
                {editingProduct && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setEditingProduct(null)}></div>
                        
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-in fade-in zoom-in duration-200">
                            <div className="bg-emerald-600 p-6 text-white flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-bold">Update Medicine</h3>
                                    <p className="text-emerald-100 text-xs">ID: {editingProduct.id}</p>
                                </div>
                                <button onClick={() => setEditingProduct(null)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                                    <X size={24} />
                                </button>
                            </div>
                            
                            <form onSubmit={handleUpdate} className="p-8 space-y-5 max-h-[70vh] overflow-y-auto">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label className="block text-xs font-black text-gray-400 uppercase mb-1">Medicine Name</label>
                                            <input className="w-full border-2 border-gray-100 focus:border-emerald-500 focus:outline-none p-3 rounded-xl transition-all" value={editingProduct.name} 
                                                onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})} required />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black text-gray-400 uppercase mb-1">Category</label>
                                            <input className="w-full border-2 border-gray-100 focus:border-emerald-500 focus:outline-none p-3 rounded-xl transition-all" value={editingProduct.category} 
                                                onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})} required />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-black text-gray-400 uppercase mb-1">Price (₹)</label>
                                            <input type="number" className="w-full border-2 border-gray-100 focus:border-emerald-500 focus:outline-none p-3 rounded-xl transition-all" value={editingProduct.price} 
                                                onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})} required />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black text-gray-400 uppercase mb-1">Stock Qty</label>
                                            <input type="number" className="w-full border-2 border-gray-100 focus:border-emerald-500 focus:outline-none p-3 rounded-xl transition-all" value={editingProduct.stock} 
                                                onChange={(e) => setEditingProduct({...editingProduct, stock: e.target.value})} required />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black text-gray-400 uppercase mb-1">Description</label>
                                        <textarea rows="3" className="w-full border-2 border-gray-100 focus:border-emerald-500 focus:outline-none p-3 rounded-xl transition-all" value={editingProduct.description} 
                                            onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}></textarea>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-xl border-2 border-dashed border-gray-200">
                                        <label className="block text-xs font-black text-gray-400 uppercase mb-2">Update Image</label>
                                        <input type="file" className="text-sm w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" onChange={(e) => setEditImage(e.target.files[0])} />
                                    </div>
                                </div>

                                <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 mt-4">
                                    <Save size={20} /> Save Changes
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;