import { useEffect } from 'react';
import { FaEnvelopeOpenText, FaDownload, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {

    const token = localStorage.getItem("esurat_login_token");
    const role = localStorage.getItem("esurat_login_role");
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/');
        }

        if (role !== 'admin') {
            navigate('/downloads');
        }
    }, [token, navigate]);

    return (
        <div className="p-8 bg-teal-50 min-h-screen">
        <h1 className="text-3xl font-bold text-teal-700 mb-2">Welcome back 👋</h1>
        <p className="text-gray-600 mb-8">Here’s what’s happening with eSurat today.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white shadow-lg rounded-xl p-6 flex items-center gap-4 hover:shadow-xl transition">
            <div className="bg-teal-100 text-teal-600 p-3 rounded-full text-xl">
                <FaEnvelopeOpenText />
            </div>
            <div>
                <h2 className="text-2xl font-bold">128</h2>
                <p className="text-gray-500">Total Letters</p>
            </div>
            </div>

            <div className="bg-white shadow-lg rounded-xl p-6 flex items-center gap-4 hover:shadow-xl transition">
            <div className="bg-teal-100 text-teal-600 p-3 rounded-full text-xl">
                <FaDownload />
            </div>
            <div>
                <h2 className="text-2xl font-bold">324</h2>
                <p className="text-gray-500">Total Downloads</p>
            </div>
            </div>

            <div className="bg-white shadow-lg rounded-xl p-6 flex items-center gap-4 hover:shadow-xl transition">
            <div className="bg-teal-100 text-teal-600 p-3 rounded-full text-xl">
                <FaUsers />
            </div>
            <div>
                <h2 className="text-2xl font-bold">12</h2>
                <p className="text-gray-500">Active Users</p>
            </div>
            </div>
        </div>
        </div>
    );
};

export default Dashboard;
