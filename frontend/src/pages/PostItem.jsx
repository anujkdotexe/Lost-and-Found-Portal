import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UploadCloud, MapPin, Tag, Type, CalendarIcon } from 'lucide-react';

const PostItem = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Lost',
        location: '',
        date: new Date().toISOString().split('T')[0]
    });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="text-center py-20 animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-800">Please log in to post an item</h2>
                <button onClick={() => navigate('/login')} className="mt-4 btn-primary">Go to Login</button>
            </div>
        );
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (image) data.append('image', image);

        try {
            const token = user.token;
            await axios.post('/api/items', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            navigate('/dashboard');
        } catch (error) {
            console.error('Error posting item:', error);
            alert('Failed to post item. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto animate-fade-in pb-12">
            <div className="bg-white p-8 rounded-3xl subtle-shadow mt-6">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Report an Item</h1>
                <p className="text-gray-500 mb-8 border-b pb-6">Help the community by providing details about what you found or lost.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex gap-4 p-1 bg-gray-50 rounded-xl mb-6">
                        <label className={`flex-1 text-center py-3 rounded-lg font-bold cursor-pointer transition-colors ${formData.category === 'Lost' ? 'bg-[var(--color-primary)] text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}>
                            <input type="radio" name="category" value="Lost" checked={formData.category === 'Lost'} onChange={handleChange} className="hidden" />
                            I Lost Something
                        </label>
                        <label className={`flex-1 text-center py-3 rounded-lg font-bold cursor-pointer transition-colors ${formData.category === 'Found' ? 'bg-[var(--color-secondary)] text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}>
                            <input type="radio" name="category" value="Found" checked={formData.category === 'Found'} onChange={handleChange} className="hidden" />
                            I Found Something
                        </label>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1 ml-1"><Type size={16} /> Item Name</label>
                        <input type="text" name="title" required value={formData.title} onChange={handleChange} className="input-field" placeholder="e.g., Fluffy Orange Cat, Blue iPhone 13" />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1 ml-1"><Tag size={16} /> Description</label>
                        <textarea name="description" required value={formData.description} onChange={handleChange} rows="3" className="input-field resize-none" placeholder="Provide helpful details..."></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1 ml-1"><MapPin size={16} /> Location</label>
                            <input type="text" name="location" required value={formData.location} onChange={handleChange} className="input-field" placeholder="e.g., Central Park, Main St Cafe" />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1 ml-1"><CalendarIcon size={16} /> Date</label>
                            <input type="date" name="date" required value={formData.date} onChange={handleChange} className="input-field text-gray-600" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Photo (Optional but helpful)</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-200 border-dashed rounded-2xl hover:border-[var(--color-primary)] transition-colors group relative overflow-hidden bg-gray-50">
                            {preview ? (
                                <div className="absolute inset-0 w-full h-full">
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="text-white font-bold text-sm">Click to change</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-1 justify-center text-center flex flex-col items-center">
                                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400 group-hover:text-[var(--color-primary)] transition-colors" />
                                    <div className="flex text-sm text-gray-600">
                                        <span className="relative cursor-pointer rounded-md font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] focus-within:outline-none">
                                            <span>Upload a file</span>
                                        </span>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                                </div>
                            )}
                            <input type="file" name="image" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button type="submit" disabled={loading} className={`w-full py-4 text-lg btn-primary shadow-md ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
                            {loading ? 'Posting...' : 'Post Item to Board ✨'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostItem;
