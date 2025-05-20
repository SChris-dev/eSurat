import { useEffect, useState } from "react";
import Api from "../Api.tsx";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const Login = () => {

    const token = localStorage.getItem('esurat_login_token');
    const role = localStorage.getItem('esurat_login_role');
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            if (role === 'admin') {
                navigate('/dashboard');
            } else if (role === 'user') {
                navigate('/downloads');
            }
        }
    }, [token]);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await Api.post('/v1/login', formData);
            const token = response.data.token;

            localStorage.setItem('esurat_login_token', token);
            localStorage.setItem('esurat_login_name', response.data.user.name);
            localStorage.setItem('esurat_login_role', response.data.user.role);

            if (response.data.user.role === 'admin') {
                navigate('/dashboard');
            } else if (response.data.user.role === 'user') {
                navigate('/downloads');
            }

            toast.success('Login successful!');
        }
        catch (error) {
            toast.error('Login failed!');
            console.error('Login failed:', error);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-100 to-white px-4">
            <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
            <h1 className="text-3xl font-extrabold text-teal-600 text-center mb-2">Welcome to eSurat</h1>
            <p className="text-sm text-gray-500 text-center mb-6">
                Your trusted platform for managing letters efficiently
            </p>
            <form onSubmit={handleSubmit}>
                <div className="mb-5">
                <label
                    className="block text-gray-700 font-medium mb-2"
                    htmlFor="email"
                >
                    Email
                </label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-600 transition"
                    required
                />
                </div>
                <div className="mb-6">
                <label
                    className="block text-gray-700 font-medium mb-2"
                    htmlFor="password"
                >
                    Password
                </label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-600 transition"
                    required
                />
                </div>
                <button
                type="submit"
                className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition duration-200 cursor-pointer"
                >
                Login
                </button>
            </form>
            <p className="text-xs text-gray-400 text-center mt-6">
                &copy; {new Date().getFullYear()} SChris. All rights reserved.
            </p>
            </div>
        </div>
    );


}

export default Login;