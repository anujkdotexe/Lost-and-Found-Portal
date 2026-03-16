import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Home, PlusCircle, MessageCircle, LogOut, User } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-white subtle-shadow sticky top-0 z-50">
            <div className="container mx-auto px-4 max-w-5xl h-16 flex items-center justify-between">
                <Link to="/" className="text-2xl font-bold flex items-center gap-2 text-[var(--color-primary)]">
                    <Search size={28} />
                    <span>FindIt</span>
                </Link>
                <div className="flex items-center gap-6">
                    <Link to="/" className="text-gray-600 hover:text-[var(--color-primary)] flex items-center gap-1 transition-colors">
                        <Home size={20} /> <span className="hidden sm:inline">Home</span>
                    </Link>
                    {user ? (
                        <>
                            <Link to="/dashboard" className="text-gray-600 hover:text-[var(--color-primary)] flex items-center gap-1 transition-colors">
                                <Search size={20} /> <span className="hidden sm:inline">Browse</span>
                            </Link>
                            <Link to="/post" className="text-gray-600 hover:text-[var(--color-primary)] flex items-center gap-1 transition-colors">
                                <PlusCircle size={20} /> <span className="hidden sm:inline">Post Item</span>
                            </Link>
                            {/* Note: We will implement an inbox mapping later, redirecting to a dummy chat for now */}
                            <Link to="/chat/inbox" className="text-gray-600 hover:text-[var(--color-primary)] flex items-center gap-1 transition-colors">
                                <MessageCircle size={20} /> <span className="hidden sm:inline">Messages</span>
                            </Link>
                            <div className="flex items-center gap-3 ml-2 pl-4 border-l border-gray-200">
                                <div className="w-8 h-8 rounded-full bg-[var(--color-secondary)] text-white flex items-center justify-center font-bold">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <button onClick={logout} className="text-gray-500 hover:text-red-500 transition-colors" title="Logout">
                                    <LogOut size={20} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex gap-3">
                            <Link to="/login" className="text-gray-600 hover:text-[var(--color-primary)] font-medium px-2 py-1">
                                Log In
                            </Link>
                            <Link to="/register" className="btn-primary text-sm px-4 py-1.5 flex items-center gap-1 shadow-sm hover:shadow-md transition-shadow">
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
