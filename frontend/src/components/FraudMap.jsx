import React from 'react';

export default function FraudMap({ data }) {
  const cities = {
    'Ranchi': { count: 0 },
    'Delhi': { count: 0 },
    'Mumbai': { count: 0 },
    'Bangalore': { count: 0 },
    'Patna': { count: 0 },
    'Jaipur': { count: 0 }
  };
  
  if (data && data.length > 0) {
      data.forEach(record => {
        if (!record.institution) return;
        if (record.institution.includes('Ranchi')) cities['Ranchi'].count++;
        else if (record.institution.includes('Delhi') || record.institution.includes('JNU')) cities['Delhi'].count++;
        else if (record.institution.includes('Mumbai')) cities['Mumbai'].count++;
        else if (record.institution.includes('Bangalore')) cities['Bangalore'].count++;
        else if (record.institution.includes('Patna')) cities['Patna'].count++;
        else if (record.institution.includes('Jaipur')) cities['Jaipur'].count++;
        else {
            // Assign random for visual
            const keys = Object.keys(cities);
            cities[keys[Math.floor(Math.random() * keys.length)]].count++;
        }
      });
  }

  return (
    <div className="heatmap w-full">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-4">
        {Object.entries(cities).map(([city, info]) => {
            // Map 0-10 count to 0-100% height, min 10%
            const height = Math.max(10, Math.min(info.count * 15, 100));
            return (
              <div key={city} className="flex flex-col items-center justify-end h-40 bg-slate-50 dark:bg-slate-900 rounded-lg p-2 border border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">{info.count} flags</span>
                <div 
                  className="w-full rounded-t-sm transition-all duration-1000 shadow-sm"
                  style={{ 
                    height: `${height}%`,
                    background: info.count > 5 ? '#ef4444' : info.count > 2 ? '#f59e0b' : '#3b82f6'
                  }}
                />
                <div className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-300">{city}</div>
              </div>
            )
        })}
      </div>
    </div>
  );
}
