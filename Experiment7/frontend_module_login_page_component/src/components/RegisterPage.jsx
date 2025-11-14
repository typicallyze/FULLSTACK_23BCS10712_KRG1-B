import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/auth/register', { username, password });
            alert('Registration successful! Please log in.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data || 'Registration failed.');
            console.error('Registration failed:', err);
        }
    };

    return (
        <div className="bg-black text-gray-200 min-h-screen flex items-center justify-center">
            <div className="bg-gray-900 p-8 rounded-none shadow-lg shadow-blue-500/30 w-full max-w-sm">
                <h2 className="text-3xl font-bold text-center mb-6 text-blue-500">Register</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block mb-2 text-sm font-medium">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-3 bg-gray-800 border border-blue-700 rounded-none text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 bg-gray-800 border border-blue-700 rounded-none text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-semibold px-5 py-3 rounded-none hover:bg-blue-500 transition-all duration-200 active:scale-95"
                    >
                        Create Account
                    </button>
                </form>
                <p className="text-center text-gray-400 mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-500 hover:text-blue-400">
                        Log In
                    </Link>
                </p>
            </div>
        </div>
    );
}