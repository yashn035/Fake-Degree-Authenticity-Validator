import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function StatsChart({ trends }) {
  const data = {
    labels: trends.map(t => new Date(t.date).toLocaleDateString('en-US', { weekday: 'short' })),
    datasets: [
      {
        label: 'Verified',
        data: trends.map(t => t.VERIFIED),
        backgroundColor: '#10b981', // emerald-500
        borderRadius: 4,
      },
      {
        label: 'Tampered',
        data: trends.map(t => t.TAMPERED),
        backgroundColor: '#ef4444', // red-500
        borderRadius: 4,
      },
      {
        label: 'Flagged',
        data: trends.map(t => t.FLAGGED),
        backgroundColor: '#f59e0b', // amber-500
        borderRadius: 4,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { usePointStyle: true, boxWidth: 6 }
      },
    },
    scales: {
      x: { stacked: true, grid: { display: false } },
      y: { stacked: true, border: { display: false } }
    }
  };

  return (
    <div className="h-64">
      <Bar data={data} options={options} />
    </div>
  );
}
