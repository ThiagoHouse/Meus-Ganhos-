import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Gain } from '@/types/Gain';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function GainsChart({ gains }: { gains: Gain[] }) {
  const grouped = gains.reduce((acc, gain) => {
    if (!acc[gain.month]) acc[gain.month] = 0;
    acc[gain.month] += gain.amount;
    return acc;
  }, {} as Record<string, number>);

  const data = {
    labels: Object.keys(grouped),
    datasets: [
      {
        label: 'Ganhos por Mês',
        data: Object.values(grouped),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  return (
    <div style={{ maxWidth: 600, marginTop: '2rem' }}>
      <Bar data={data} />
    </div>
  );
}
