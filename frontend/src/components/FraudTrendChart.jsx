import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function FraudTrendChart({ trends }) {
    if (!trends || trends.length === 0) return <p className="text-slate-500 text-sm">No trend data available.</p>;

    const data = {
        labels: trends.map(t => new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
        datasets: [
            {
                label: 'Verified',
                data: trends.map(t => t.verified),
                borderColor: '#10b981', // emerald
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                tension: 0.4
            },
            {
                label: 'Tampered/Flagged',
                data: trends.map(t => t.tampered + t.flagged + t.blacklisted + t.notFound),
                borderColor: '#ef4444', // red
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                fill: true,
                tension: 0.4
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top', labels: { usePointStyle: true, boxWidth: 6 } },
        },
        scales: {
            x: { grid: { display: false } },
            y: { grid: { borderDash: [2, 4], color: 'rgba(0,0,0,0.05)' }, beginAtZero: true }
        }
    };

    return (
        <div className="h-64">
            <Line data={data} options={options} />
        </div>
    );
}
