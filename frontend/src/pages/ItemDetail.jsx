import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MapPin, Calendar, Heart, Share2, MessageCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const ItemDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const { data } = await axios.get(`/api/items/${id}`);
                setItem(data);
            } catch (error) {
                console.error('Failed to fetch item:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchItem();
    }, [id]);

    const handleStatusUpdate = async () => {
        try {
            const dataToUpdate = { status: item.status === 'Unclaimed' ? 'Claimed' : 'Unclaimed' };
            const { data } = await axios.put(`/api/items/${id}`, dataToUpdate, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setItem({ ...item, status: data.status });
        } catch (error) {
            console.error('Failed to update status:', error);
            alert('Could not update status.');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this listing?')) {
            try {
                await axios.delete(`/api/items/${id}`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                navigate('/dashboard');
            } catch (error) {
                console.error('Failed to delete:', error);
                alert('Could not delete item.');
            }
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
        </div>
    );

    if (!item) return <div className="text-center py-20 text-xl font-bold text-gray-600">Item not found. 😿</div>;

    const isOwner = user && user._id === item.owner._id;
    const isLost = item.category === 'Lost';

    return (
        <div className="max-w-4xl mx-auto animate-fade-in pb-12 mt-6">
            <div className="bg-white rounded-3xl subtle-shadow overflow-hidden flex flex-col md:flex-row border border-gray-50">
                {/* Image Section */}
                <div className="md:w-1/2 bg-gray-100 flex items-center justify-center relative min-h-[300px]">
                    {item.image ? (
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-gray-400 flex flex-col items-center">
                            <Heart size={48} className="mb-4 opacity-30" />
                            <span className="font-medium text-lg">No image provided</span>
                        </div>
                    )}
                    <div className={`absolute top-4 left-4 px-4 py-1.5 rounded-full font-bold shadow-md ${isLost ? 'bg-[#ffeaf0] text-[var(--color-primary)]' : 'bg-[#eaf3ff] text-[var(--color-secondary)]'
                        }`}>
                        {item.category}
                    </div>
                </div>

                {/* Info Section */}
                <div className="md:w-1/2 p-8 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                        <h1 className="text-3xl font-extrabold text-gray-800 leading-tight">{item.title}</h1>
                        <button className="text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-full transition-colors"><Share2 size={20} /></button>
                    </div>

                    <div className="flex flex-col gap-3 mb-6 mt-4 pb-6 border-b border-gray-100">
                        <div className="flex items-center text-gray-600 bg-gray-50 rounded-lg p-2 px-3 w-fit">
                            <AlertCircle size={18} className="mr-2 text-[var(--color-secondary)]" />
                            <span className="font-bold mr-2 text-gray-700">Status:</span>
                            <span className={`font-semibold ${item.status === 'Claimed' ? 'text-green-500' : 'text-orange-400'}`}>{item.status}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <MapPin size={18} className="mr-2 text-gray-400" /> <span className="font-semibold text-gray-700 mr-2">Location:</span> {item.location}
                        </div>
                        <div className="flex items-center text-gray-600">
                            <Calendar size={18} className="mr-2 text-gray-400" /> <span className="font-semibold text-gray-700 mr-2">Date {isLost ? 'Lost' : 'Found'}:</span> {format(new Date(item.date), 'MMMM dd, yyyy')}
                        </div>
                    </div>

                    <div className="mb-8 flex-grow">
                        <h3 className="font-bold text-gray-800 text-lg mb-2">Description</h3>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-xl text-sm border border-gray-100">{item.description}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-auto">
                        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-2xl border border-gray-100 mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[var(--color-secondary)] text-white flex items-center justify-center font-bold">
                                    {item.owner.avatar ? <img src={item.owner.avatar} className="w-full h-full rounded-full" /> : item.owner.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="text-sm">
                                    <p className="text-gray-500 font-medium leading-none mb-1">Posted by</p>
                                    <p className="font-bold text-gray-800">{item.owner.name}</p>
                                </div>
                            </div>
                        </div>

                        {!isOwner && user && item.status !== 'Claimed' && (
                            <button onClick={() => navigate(`/chat/${item.owner._id}?itemId=${item._id}`)} className="w-full btn-primary py-3 text-lg flex items-center justify-center gap-2 shadow-md">
                                <MessageCircle size={22} /> Contact {item.owner.name.split(' ')[0]}
                            </button>
                        )}
                        {!user && (
                            <p className="text-center text-sm text-gray-500 bg-gray-50 p-4 rounded-xl">
                                Please <button onClick={() => navigate('/login')} className="text-[var(--color-primary)] font-bold hover:underline">log in</button> to contact the owner.
                            </p>
                        )}

                        {isOwner && (
                            <div className="flex justify-between mt-4">
                                <button onClick={handleStatusUpdate} className="bg-green-100 text-green-700 hover:bg-green-200 font-bold py-2.5 px-6 rounded-xl transition-colors w-1/2 mr-2">
                                    Mark as {item.status === 'Unclaimed' ? 'Claimed ✨' : 'Unclaimed'}
                                </button>
                                <button onClick={handleDelete} className="bg-red-50 text-red-600 hover:bg-red-100 font-bold py-2.5 px-6 rounded-xl transition-colors w-1/2 ml-2">
                                    Delete Post
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemDetail;
