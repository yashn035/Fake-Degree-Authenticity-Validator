import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function InstitutionHeatmap({ data }) {
    if (!data || data.length === 0) return <p className="text-slate-500 text-sm">No fraud data available.</p>;

    const chartData = {
        labels: data.map(d => d.name),
        datasets: [
            {
                label: 'Fraud Incidents',
                data: data.map(d => d.count),
                backgroundColor: 'rgba(239, 68, 68, 0.7)', // red-500 with opacity
                borderColor: 'rgb(239, 68, 68)',
                borderWidth: 1,
                borderRadius: 4,
            }
        ]
    };

    const options = {
        indexAxis: 'y', // horizontal bar chart
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { display: true, color: 'rgba(0,0,0,0.05)' } },
            y: { grid: { display: false } }
        }
    };

    return (
        <div className="h-64">
            <Bar data={chartData} options={options} />
        </div>
    );
}
