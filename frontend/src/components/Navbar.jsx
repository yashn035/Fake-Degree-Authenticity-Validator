import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Moon, Sun, LogOut, Mic, MicOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import { useState, useEffect } from 'react';

export default function Navbar({ darkMode, setDarkMode }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voicesLoaded, setVoicesLoaded] = useState(false);

    // Pre-load voices to avoid the Chrome first-click bug
    useEffect(() => {
        const loadVoices = () => {
            if (window.speechSynthesis.getVoices().length > 0) {
                setVoicesLoaded(true);
            }
        };
        loadVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const toggleVoiceDemo = () => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }

        window.speechSynthesis.cancel(); // clear any stuck queue
        
        const text = "Welcome to the Edu Verify AI Demo. Upload a genuine certificate to see instant verification. Upload a tampered certificate to see the A.I. detect anomalies. View the admin dashboard for real-time fraud alerts and geographic analytics.";
        const msg = new SpeechSynthesisUtterance(text);
        
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
            // Try to find a premium Google English voice, fallback to any English, then default
            msg.voice = voices.find(v => v.lang.includes('en') && v.name.includes('Google')) 
                     || voices.find(v => v.lang.includes('en')) 
                     || voices[0];
        }

        msg.onstart = () => setIsSpeaking(true);
        msg.onend = () => setIsSpeaking(false);
        msg.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(msg);
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
                                <Link to="/dashboard" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 font-medium transition-colors">Verify Certificate</Link>
                                <Link to="/login" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 font-medium transition-colors">Login</Link>
                                <Link to="/signup" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Sign Up</Link>
                            </>
                        ) : (
                            <>
                                <Link to="/dashboard" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 font-medium transition-colors">Dashboard</Link>
                                {user.role === 'admin' && (
                                    <>
                                        <button 
                                            onClick={toggleVoiceDemo}
                                            className={`flex items-center gap-2 font-bold transition-all px-3 py-1.5 rounded-lg border ${
                                                isSpeaking 
                                                ? 'bg-purple-600 text-white border-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.5)] animate-pulse' 
                                                : 'text-purple-600 dark:text-purple-400 hover:text-purple-800 hover:bg-purple-100 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
                                            }`}
                                        >
                                            {isSpeaking ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                                            {isSpeaking ? 'Stop Demo' : 'Voice Demo'}
                                        </button>
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
