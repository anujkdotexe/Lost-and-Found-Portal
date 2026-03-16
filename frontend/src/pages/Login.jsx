import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const success = await login(email, password);
        if (success) {
            navigate('/dashboard');
        } else {
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="flex justify-center mt-10 animate-fade-in relative">
            <div className="w-full max-w-md bg-white p-8 rounded-3xl subtle-shadow border border-gray-100 relative z-10">
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Welcome Back! ✨</h2>
                {error && <div className="bg-red-50 text-red-500 p-3 rounded-xl mb-4 text-center text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
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
                    <button type="submit" className="w-full btn-primary py-3 text-lg mt-4 shadow-sm">
                        Log In
                    </button>
                </form>

                <p className="mt-8 text-center text-gray-500 text-sm">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-[var(--color-primary)] font-semibold hover:underline">
                        Sign up here
                    </Link>
                </p>
            </div>

            {/* Cute background decoration blobs */}
            <div className="absolute top-10 -left-10 w-32 h-32 bg-[#ffecf0] rounded-full blur-xl -z-10 opacity-70"></div>
            <div className="absolute bottom-10 -right-10 w-40 h-40 bg-[#e8f0ff] rounded-full blur-xl -z-10 opacity-70"></div>
        </div>
    );
};

export default Login;
