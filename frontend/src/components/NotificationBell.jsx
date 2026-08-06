import { Bell } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getAlerts } from '../api/apiClient';

export default function NotificationBell() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const data = await getAlerts();
                const unresolved = data.filter(a => !a.resolved).length;
                setCount(unresolved);
            } catch (err) {
                console.error('Failed to fetch alerts', err);
            }
        };
        fetchAlerts();
        const interval = setInterval(fetchAlerts, 10000); // poll every 10s
        return () => clearInterval(interval);
    }, []);

    return (
        <button className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            {count > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-800 animate-pulse">
                    {count > 99 ? '99+' : count}
                </span>
            )}
        </button>
    );
}
