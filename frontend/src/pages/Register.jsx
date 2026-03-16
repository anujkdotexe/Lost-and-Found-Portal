import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const success = await register(name, email, password);
        if (success) {
            navigate('/dashboard');
        } else {
            setError('Registration failed. Try a different email.');
        }
    };

    return (
        <div className="flex justify-center mt-10 animate-fade-in relative">
            <div className="w-full max-w-md bg-white p-8 rounded-3xl subtle-shadow border border-gray-100 relative z-10">
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Join FindIt 🌟</h2>
                {error && <div className="bg-red-50 text-red-500 p-3 rounded-xl mb-4 text-center text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 ml-1 cursor-pointer" htmlFor="name">Full Name</label>
                        <input
                            id="name"
                            type="text"
                            required
                            className="input-field"
                            placeholder="Alex Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 ml-1 cursor-pointer" htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            required
                            className="input-field"
                            placeholder="you@cute.cats"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 ml-1 cursor-pointer" htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            required
                            className="input-field"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="w-full btn-secondary py-3 text-lg mt-4 shadow-sm hover:shadow-md transition-shadow">
                        Create Account
                    </button>
                </form>

                <p className="mt-8 text-center text-gray-500 text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-[var(--color-secondary)] font-semibold hover:underline">
                        Log in
                    </Link>
                </p>
            </div>

            {/* Cute background decoration blobs */}
            <div className="absolute -top-6 -right-10 w-24 h-24 bg-[#ffecf0] rounded-full blur-xl -z-10 opacity-70"></div>
            <div className="absolute top-40 -left-12 w-32 h-32 bg-[#e8f0ff] rounded-full blur-xl -z-10 opacity-70"></div>
        </div>
    );
};

export default Register;
