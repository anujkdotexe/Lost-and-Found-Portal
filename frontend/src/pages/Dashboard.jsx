import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ItemCard from '../components/ItemCard';
import { Search, Filter, Compass } from 'lucide-react';

const Dashboard = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        fetchItems();
    }, [filter]);

    const fetchItems = async () => {
        setLoading(true);
        try {
            let url = '/api/items';
            if (filter !== 'All') {
                url += `?category=${filter}`;
            }
            const { data } = await axios.get(url);
            setItems(data);
        } catch (error) {
            console.error('Failed to fetch items:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let url = `/api/items?search=${searchTerm}`;
            if (filter !== 'All') url += `&category=${filter}`;
            const { data } = await axios.get(url);
            setItems(data);
        } catch (error) {
            console.error('Failed to search items:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in pb-12">
            <div className="mb-10 text-center max-w-2xl mx-auto mt-6">
                <div className="inline-flex items-center justify-center p-3 bg-[#f8f9fa] rounded-full mb-4">
                    <Compass className="text-gray-600" size={28} />
                </div>
                <h1 className="text-3xl font-extrabold text-gray-800 mb-3">Community Board</h1>
                <p className="text-gray-500">Browse reported missing and found items around the community.</p>
            </div>

            <div className="bg-white p-4 rounded-3xl subtle-shadow mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex w-full md:w-auto p-1 bg-gray-50 rounded-full border border-gray-100">
                    {['All', 'Lost', 'Found'].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${filter === cat
                                    ? cat === 'Lost' ? 'bg-[#ffeaf0] text-[var(--color-primary)] shadow-sm'
                                        : cat === 'Found' ? 'bg-[#eaf3ff] text-[var(--color-secondary)] shadow-sm'
                                            : 'bg-white text-gray-800 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSearch} className="relative w-full md:w-80">
                    <input
                        type="text"
                        placeholder="Search items..."
                        className="w-full bg-gray-50 border-none rounded-full py-3 pl-5 pr-12 text-sm focus:ring-2 focus:ring-[var(--color-secondary)] focus:bg-white transition-all outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit" className="absolute right-2 top-1.5 p-1.5 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 transition-colors">
                        <Search size={18} />
                    </button>
                </form>
            </div>

            {loading ? (
                <div className="flex justify-center my-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
                </div>
            ) : items.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl subtle-shadow border border-gray-50 flex flex-col items-center">
                    <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                        <Filter className="text-gray-300" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">No items found</h3>
                    <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map(item => (
                        <ItemCard key={item._id} item={item} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
