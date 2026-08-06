import { Bell, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { getAlerts, resolveAlert } from '../api/apiClient';
import { Link } from 'react-router-dom';

export default function NotificationBell() {
    const [alerts, setAlerts] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const fetchAlerts = async () => {
        try {
            const data = await getAlerts();
            setAlerts(data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
        } catch (err) {
            console.error('Failed to fetch alerts', err);
        }
    };

    useEffect(() => {
        fetchAlerts();
        const interval = setInterval(fetchAlerts, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleResolve = async (e, id) => {
        e.stopPropagation();
        await resolveAlert(id);
        fetchAlerts();
    };

    const unresolvedAlerts = alerts.filter(a => !a.resolved);
    const count = unresolvedAlerts.length;

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`relative p-2 rounded-full transition-colors ${isOpen ? 'bg-slate-100 dark:bg-slate-700' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}
            >
                <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                {count > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-800 animate-pulse">
                        {count > 99 ? '99+' : count}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                        <h3 className="font-bold text-slate-800 dark:text-white">Notifications</h3>
                        <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded-full font-medium">
                            {count} New
                        </span>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                        {alerts.length === 0 ? (
                            <div className="p-6 text-center text-slate-500 dark:text-slate-400">
                                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-500 opacity-50" />
                                <p className="text-sm">You're all caught up!</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                {alerts.slice(0, 5).map(alert => (
                                    <div key={alert.id} className={`p-4 transition-colors ${alert.resolved ? 'opacity-60 bg-white dark:bg-slate-800' : 'bg-red-50/50 dark:bg-red-900/10'}`}>
                                        <div className="flex gap-3">
                                            <div className="mt-0.5">
                                                {alert.resolved ? (
                                                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                                                ) : (
                                                    <AlertTriangle className="w-5 h-5 text-red-500" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className={`text-sm ${alert.resolved ? 'text-slate-600 dark:text-slate-400' : 'text-slate-800 dark:text-slate-200 font-medium'}`}>
                                                    {alert.message}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    {new Date(alert.timestamp).toLocaleTimeString()}
                                                </p>
                                            </div>
                                        </div>
                                        {!alert.resolved && (
                                            <div className="mt-3 flex justify-end">
                                                <button 
                                                    onClick={(e) => handleResolve(e, alert.id)}
                                                    className="text-xs px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors font-medium text-slate-700 dark:text-slate-200"
                                                >
                                                    Mark as resolved
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-center">
                        <Link to="/admin" onClick={() => setIsOpen(false)} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                            View all alerts in Dashboard
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
