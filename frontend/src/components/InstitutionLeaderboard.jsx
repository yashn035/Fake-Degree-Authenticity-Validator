import React from 'react';
import { Award, AlertTriangle } from 'lucide-react';

export default function InstitutionLeaderboard({ data }) {
  if (!data || !data.verified || !data.offenders) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {/* Top Verified */}
      <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-100 dark:border-emerald-800">
        <h4 className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-400 mb-4">
          <Award className="w-5 h-5" /> Top Authentic Institutions
        </h4>
        <div className="space-y-3">
          {data.verified.length === 0 ? <p className="text-sm text-emerald-600/70">No verified data yet.</p> : null}
          {data.verified.map((inst, i) => (
            <div key={i} className="flex justify-between items-center bg-white dark:bg-slate-800 p-2 rounded shadow-sm border border-emerald-100 dark:border-slate-700">
              <span className="font-medium text-slate-700 dark:text-slate-300 text-sm truncate pr-2">{i+1}. {inst.name}</span>
              <span className="font-bold text-emerald-600">{inst.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Offenders */}
      <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-100 dark:border-red-800">
        <h4 className="flex items-center gap-2 font-bold text-red-800 dark:text-red-400 mb-4">
          <AlertTriangle className="w-5 h-5" /> Highest Fraud Risk
        </h4>
        <div className="space-y-3">
          {data.offenders.length === 0 ? <p className="text-sm text-red-600/70">No fraud data yet.</p> : null}
          {data.offenders.map((inst, i) => (
            <div key={i} className="flex justify-between items-center bg-white dark:bg-slate-800 p-2 rounded shadow-sm border border-red-100 dark:border-slate-700">
              <span className="font-medium text-slate-700 dark:text-slate-300 text-sm truncate pr-2">{i+1}. {inst.name}</span>
              <span className="font-bold text-red-600">{inst.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
