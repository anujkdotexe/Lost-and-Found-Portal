import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await axios.post('/api/auth/login', { email, password });
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
            return true;
        } catch (error) {
            console.error('Login error:', error.response?.data?.message || error.message);
            return false;
        }
    };

    const register = async (name, email, password) => {
        try {
            const { data } = await axios.post('/api/auth/register', { name, email, password });
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
            return true;
        } catch (error) {
            console.error('Register error:', error.response?.data?.message || error.message);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
