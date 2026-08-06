import { useState, useEffect } from 'react';
import { Activity, AlertOctagon, Users, ShieldAlert } from 'lucide-react';

function Counter({ end, duration = 1000 }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) window.requestAnimationFrame(step);
        };
        window.requestAnimationFrame(step);
    }, [end, duration]);

    return <span>{count}</span>;
}

export default function AnalyticsKPICards({ data }) {
    if (!data) return null;

    const isHighFraud = parseFloat(data.fraudRate) > 20;
    const isLowFraud = parseFloat(data.fraudRate) < 10;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center justify-between shadow-sm">
                <div>
                    <p className="text-sm text-slate-500 font-medium">Total Verifications</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        <Counter end={data.totalVerifications} />
                    </p>
                </div>
                <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Activity className="w-5 h-5" />
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center justify-between shadow-sm">
                <div>
                    <p className="text-sm text-slate-500 font-medium">Fraud Rate</p>
                    <p className={`text-2xl font-bold ${isHighFraud ? 'text-red-600' : isLowFraud ? 'text-emerald-600' : 'text-amber-500'}`}>
                        {data.fraudRate}%
                    </p>
                </div>
                <div className="h-10 w-10 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300">
                    <AlertOctagon className="w-5 h-5" />
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center justify-between shadow-sm">
                <div>
                    <p className="text-sm text-slate-500 font-medium">Avg Fraud Score</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        <Counter end={data.fraudScore} /> <span className="text-sm font-normal text-slate-400">/ 100</span>
                    </p>
                </div>
                <div className="h-10 w-10 bg-purple-50 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <ShieldAlert className="w-5 h-5" />
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center justify-between shadow-sm">
                <div>
                    <p className="text-sm text-slate-500 font-medium">Unique Offenders</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        <Counter end={data.uniqueOffenders} />
                    </p>
                </div>
                <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Users className="w-5 h-5" />
                </div>
            </div>
        </div>
    );
}
