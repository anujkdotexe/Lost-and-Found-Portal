import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, MapPin, Heart } from 'lucide-react';

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
            <div className="bg-white p-4 rounded-full shadow-sm mb-6 inline-flex">
                <Heart className="text-[var(--color-primary)]" size={48} />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-6 leading-tight">
                Lost it? <span className="text-[var(--color-primary)]">Find it.</span><br />
                Return it.
            </h1>
            <p className="text-gray-500 text-lg max-w-xl mb-10 leading-relaxed">
                A simple and cute community platform to help you track down missing items or reunite found treasures with their owners.
            </p>
            <div className="flex gap-4">
                {user ? (
                    <Link to="/dashboard" className="btn-primary text-lg px-8 py-3 shadow-md hover:shadow-lg flex items-center gap-2">
                        <Search size={22} /> Explore Board
                    </Link>
                ) : (
                    <>
                        <Link to="/register" className="btn-primary text-lg px-8 py-3 shadow-md hover:shadow-lg">
                            Get Started
                        </Link>
                        <Link to="/dashboard" className="bg-white text-gray-700 border border-gray-200 text-lg px-8 py-3 rounded-full font-semibold hover:bg-gray-50 transition-colors shadow-sm">
                            Browse Items
                        </Link>
                    </>
                )}
            </div>

            <div className="mt-24 grid md:grid-cols-3 gap-8 w-full">
                <div className="bg-white rounded-3xl p-8 subtle-shadow text-center flex flex-col items-center border border-gray-50 hover:border-[var(--color-primary)] transition-colors cursor-default group">
                    <div className="w-16 h-16 rounded-2xl bg-[#fff0f3] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Search className="text-[var(--color-primary)]" size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Report Lost</h3>
                    <p className="text-gray-500 text-sm">Create a listing for an item you've misplaced. Add photos and locations.</p>
                </div>
                <div className="bg-white rounded-3xl p-8 subtle-shadow text-center flex flex-col items-center border border-gray-50 hover:border-[var(--color-secondary)] transition-colors cursor-default group">
                    <div className="w-16 h-16 rounded-2xl bg-[#eef4ff] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <MapPin className="text-[var(--color-secondary)]" size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Report Found</h3>
                    <p className="text-gray-500 text-sm">Found something? Upload it and help connect it back to its owner.</p>
                </div>
                <div className="bg-white rounded-3xl p-8 subtle-shadow text-center flex flex-col items-center border border-gray-50 hover:border-[#ffcda3] transition-colors cursor-default group">
                    <div className="w-16 h-16 rounded-2xl bg-[#fff6ee] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Heart className="text-[#ffab6e]" size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Connect</h3>
                    <p className="text-gray-500 text-sm">Chat securely in real-time to arrange a safe return.</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
