import { CheckCircle2, XCircle, AlertTriangle, HelpCircle } from 'lucide-react';

const badgeConfig = {
  VERIFIED: { color: 'text-emerald-700 bg-emerald-50 border-emerald-200', icon: CheckCircle2, label: 'Verified' },
  TAMPERED: { color: 'text-red-700 bg-red-50 border-red-200', icon: XCircle, label: 'Tampered' },
  FLAGGED: { color: 'text-amber-700 bg-amber-50 border-amber-200', icon: AlertTriangle, label: 'Flagged' },
  NOT_FOUND: { color: 'text-slate-700 bg-slate-50 border-slate-200', icon: HelpCircle, label: 'Not Found' }
};

export default function VerificationTable({ logs }) {
  if (!logs || logs.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        No verification attempts recorded yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-100">
          <tr>
            <th className="px-4 py-3 font-medium rounded-tl-lg">Timestamp</th>
            <th className="px-4 py-3 font-medium">Cert ID</th>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium rounded-tr-lg">Verdict</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {logs.map((log, idx) => {
            const date = new Date(log.timestamp);
            const config = badgeConfig[log.verdict] || badgeConfig.NOT_FOUND;
            const Icon = config.icon;

            return (
              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-slate-500">
                  {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="px-4 py-3 font-medium text-slate-900">{log.certId}</td>
                <td className="px-4 py-3 text-slate-700">{log.name}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                    {config.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
