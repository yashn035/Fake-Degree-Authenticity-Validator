import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function FraudScoreDistribution({ score }) {
    // We'll visualize the singular average score as a gauge using Doughnut
    
    let color = '#ef4444'; // Red (High risk)
    if (score < 30) color = '#10b981'; // Green
    else if (score < 60) color = '#f59e0b'; // Yellow
    
    const data = {
        labels: ['Fraud Score', 'Remaining'],
        datasets: [
            {
                data: [score, 100 - score],
                backgroundColor: [color, 'rgba(0,0,0,0.05)'],
                borderWidth: 0,
                cutout: '80%',
                circumference: 180,
                rotation: 270
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } }
    };

    return (
        <div className="relative h-48 flex items-end justify-center pb-2">
            <div className="absolute w-full h-full pb-6">
                <Doughnut data={data} options={options} />
            </div>
            <div className="text-center z-10 flex flex-col items-center">
                <span className="text-4xl font-black text-slate-800 dark:text-white">{score}</span>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-widest mt-1">Risk Index</span>
            </div>
        </div>
    );
}
