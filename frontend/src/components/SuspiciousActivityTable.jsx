import { AlertTriangle, ShieldX } from 'lucide-react';

export default function SuspiciousActivityTable({ activities }) {
    if (!activities || activities.length === 0) return <p className="text-slate-500 text-sm">No suspicious activity detected.</p>;

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-700 text-slate-500">
                        <th className="pb-3 font-medium">Timestamp</th>
                        <th className="pb-3 font-medium">Cert ID</th>
                        <th className="pb-3 font-medium">Institution</th>
                        <th className="pb-3 font-medium">Verdict</th>
                        <th className="pb-3 font-medium text-right">Risk Score</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {activities.map((a, i) => (
                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="py-3 text-slate-500">{new Date(a.timestamp).toLocaleString()}</td>
                            <td className="py-3 font-medium text-slate-900 dark:text-white">{a.certId || 'Unknown'}</td>
                            <td className="py-3 text-slate-600 dark:text-slate-300">{a.institution}</td>
                            <td className="py-3">
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                                    a.verdict === 'TAMPERED' ? 'bg-red-100 text-red-700' :
                                    a.verdict === 'BLACKLISTED' ? 'bg-purple-100 text-purple-700' :
                                    'bg-amber-100 text-amber-700'
                                }`}>
                                    {a.verdict === 'BLACKLISTED' ? <ShieldX className="w-3 h-3"/> : <AlertTriangle className="w-3 h-3"/>}
                                    {a.verdict}
                                </span>
                            </td>
                            <td className="py-3 text-right">
                                <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{a.fraudScore}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
