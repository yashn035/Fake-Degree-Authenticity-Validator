import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Moon, Sun, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

export default function Navbar({ darkMode, setDarkMode }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <Link to="/" className="flex items-center gap-2">
                        <ShieldCheck className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        <span className="font-bold text-xl text-slate-800 dark:text-white">EduVerify AI</span>
                    </Link>
                    <div className="flex items-center space-x-6">
                        <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
                        </button>
                        
                        {!user ? (
                            <>
                                <Link to="/login" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 font-medium transition-colors">Login</Link>
                                <Link to="/signup" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Sign Up</Link>
                            </>
                        ) : (
                            <>
                                <Link to="/dashboard" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 font-medium transition-colors">Dashboard</Link>
                                {user.role === 'admin' && (
                                    <>
                                        <Link to="/admin" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 font-medium transition-colors">Admin Panel</Link>
                                        <NotificationBell />
                                    </>
                                )}
                                <div className="flex items-center gap-4 ml-4 pl-4 border-l border-slate-200 dark:border-slate-700">
                                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{user.fullName}</span>
                                    <button onClick={handleLogout} className="text-slate-500 hover:text-red-500 transition-colors" title="Logout">
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
