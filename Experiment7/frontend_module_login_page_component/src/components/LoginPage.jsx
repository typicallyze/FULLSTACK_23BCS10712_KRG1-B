import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.post('/auth/login', { username, password });
            localStorage.setItem('jwtToken', response.data.token);
            navigate('/');
        } catch (err) {
            setError('Invalid username or password.');
            console.error('Login failed:', err);
        }
    };

    return (
        <div className="bg-black text-gray-200 min-h-screen flex items-center justify-center">
            <div className="bg-gray-900 p-8 rounded-none shadow-lg shadow-blue-500/30 w-full max-w-sm">
                <h2 className="text-3xl font-bold text-center mb-6 text-blue-500">Log In</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleLogin} className="space-y-4">
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
                        Log In
                    </button>
                </form>
                <p className="text-center text-gray-400 mt-6">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-500 hover:text-blue-400">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}