import React, { useState } from 'react';
import axios from 'axios';

const LinkedInDashboard = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://127.0.0.1:5000/getLinkedInPers?username=${username}&password=${password}`);
            setProfile(response.data.profile);
            console.log("Linked Profile",response.data.profile)
            setError('');
        } catch (err) {
            setError('Login failed: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    LinkedIn Dashboard
                </h1>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-gray-700 font-semibold mb-2">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                        Login
                    </button>
                </form>

                {profile && (
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold text-gray-800">Welcome, {profile.firstName}</h2>
                        <p className="text-gray-700">Headline: {profile.headline}</p>
                        <p className="text-gray-700">Location: {profile.location}</p>
                        {/* You can add more fields from the profile */}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LinkedInDashboard;
