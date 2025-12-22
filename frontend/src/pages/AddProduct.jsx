import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Upload, X, Check, Loader2 } from 'lucide-react';

const AddProduct = () => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null); // Image preview state
    const [isSubmitting, setIsSubmitting] = useState(false); // Loading state
    
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file)); // Create a local URL for preview
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const formData = new FormData();
        formData.append('name', name);
        formData.append('category', category);
        formData.append('price', price);
        formData.append('stock', stock);
        formData.append('description', description);
        formData.append('image', image);

        try {
            await api.post('/medicines/add', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            navigate('/admin/dashboard');
        } catch (err) {
            console.error(err);
            alert("Failed to add product");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
       /* Changed items-center to items-start and added pt-32 */
<div className="min-h-screen bg-[#f8fafc] flex justify-center items-center p-4 md:p-4">
    <div className="mt-20 bg-white rounded-3xl shadow-2xl w-full max-w-2xl border border-gray-100 relative overflow-hidden flex flex-col md:flex-row">
                
                {/* Visual Accent (Left side on desktop) */}
                <div className="hidden md:flex md:w-1/3 bg-emerald-600 p-8 text-white flex-col justify-between">
                    <div>
                        <PlusCircle size={40} className="mb-4 opacity-80" />
                        <h2 className="text-2xl font-black leading-tight">Inventory Growth</h2>
                        <p className="text-emerald-100 text-sm mt-4 opacity-90">Adding new stock helps MediCare+ reach more people in need.</p>
                    </div>
                    <div className="text-xs opacity-50 font-mono">ADMIN ACCESS ONLY</div>
                </div>

                <div className="p-6 md:p-10 flex-grow relative">
                    {/* EXIT BUTTON */}
                    <button 
                        onClick={() => navigate('/admin/dashboard')} 
                        className="absolute top-6 right-6 text-gray-400 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-xl transition-all"
                    >
                        <X size={20} />
                    </button>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800">Add New Medicine</h2>
                        <p className="text-gray-400 text-sm">Please enter precise pharmaceutical details.</p>
                    </div>

                    <form onSubmit={handleAddProduct} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Medicine Name</label>
                                <input 
                                    type="text" 
                                    className="w-full p-3 bg-gray-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-xl transition-all outline-none" 
                                    placeholder="e.g. Amoxicillin 250mg"
                                    value={name} onChange={(e) => setName(e.target.value)} required 
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Category</label>
                                <input 
                                    type="text" 
                                    className="w-full p-3 bg-gray-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-xl transition-all outline-none" 
                                    placeholder="e.g. Painkiller"
                                    value={category} onChange={(e) => setCategory(e.target.value)} required 
                                />
                            </div>
                            
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Price (₹)</label>
                                <input 
                                    type="number" 
                                    className="w-full p-3 bg-gray-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-xl transition-all outline-none" 
                                    placeholder="0"
                                    value={price} onChange={(e) => setPrice(e.target.value)} required 
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Stock Units</label>
                                <input 
                                    type="number" 
                                    className="w-full p-3 bg-gray-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-xl transition-all outline-none" 
                                    placeholder="Qty"
                                    value={stock} onChange={(e) => setStock(e.target.value)} required 
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Product Image</label>
                                <div className={`border-2 border-dashed rounded-2xl transition-all flex items-center justify-center relative min-h-[120px] ${preview ? 'border-emerald-500 bg-emerald-50/30' : 'border-gray-200 hover:border-emerald-400 hover:bg-gray-50'}`}>
                                    <input 
                                        type="file" 
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        onChange={handleImageChange}
                                        required
                                    />
                                    {preview ? (
                                        <div className="flex items-center gap-4 p-2">
                                            <img src={preview} alt="Preview" className="w-16 h-16 object-cover rounded-lg shadow-md border-2 border-white" />
                                            <div className="text-left">
                                                <p className="text-xs font-bold text-emerald-700 flex items-center gap-1"><Check size={14}/> Image Selected</p>
                                                <p className="text-[10px] text-gray-500 truncate max-w-[150px]">{image?.name}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <Upload className="mx-auto text-gray-300 mb-1" size={24} />
                                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tighter">Upload Packaging Photo</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Description</label>
                                <textarea 
                                    className="w-full p-3 bg-gray-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-xl transition-all outline-none resize-none" 
                                    rows="2"
                                    placeholder="Indications, dosage info..."
                                    value={description} onChange={(e) => setDescription(e.target.value)}
                                ></textarea>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2 ${
                                isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
                            }`}
                        >
                            {isSubmitting ? (
                                <><Loader2 className="animate-spin" size={20} /> Processing...</>
                            ) : (
                                'Confirm & Add to Inventory'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;