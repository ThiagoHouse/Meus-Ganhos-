import { useEffect, useState } from 'react';
import { Gain } from '@/types/Gain';
import { loadGains, saveGains } from '@/utils/storage';
import { v4 as uuidv4 } from 'uuid';
import GainsChart from '@/components/GainsChart';


export default function Home() {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [month, setMonth] = useState('');
  const [gains, setGains] = useState<Gain[]>([]);

  useEffect(() => {
    setGains(loadGains());
  }, []);

  function handleAddGain(e: React.FormEvent) {
    e.preventDefault();

    const newGain: Gain = {
      id: uuidv4(),
      category,
      amount: parseFloat(amount),
      month,
    };

    const updated = [...gains, newGain];
    saveGains(updated);
    setGains(updated);
    setCategory('');
    setAmount('');
    setMonth('');
  }

  const groupedByMonth = gains.reduce((acc, gain) => {
    if (!acc[gain.month]) acc[gain.month] = 0;
    acc[gain.month] += gain.amount;
    return acc;
  }, {} as { [month: string]: number });

  return (
    <div className="container">
      <h1>Ganhos Mensais</h1>

      <form onSubmit={handleAddGain} style={{ marginBottom: '2rem' }}>
        <div>
          <label>Categoria:</label><br />
          <input value={category} onChange={(e) => setCategory(e.target.value)} required />
        </div>

        <div>
          <label>Valor:</label><br />
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </div>

        <div>
          <label>Mês:</label><br />
          <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} required />
        </div>

        <button type="submit" style={{ marginTop: '1rem' }}>Adicionar Ganho</button>
      </form>

      <h2>Resumo por Mês</h2>
      <ul>
        {Object.entries(groupedByMonth).map(([m, total]) => (
          <li key={m}>
            {m}: R$ {total.toFixed(2)}
          </li>
        ))}
      </ul>

      <GainsChart gains={gains} />

      <h2>Todos os Ganhos</h2>
      <ul>
        {gains.map((g) => (
          <li key={g.id}>
            [{g.month}] {g.category}: R$ {g.amount.toFixed(2)}
            <button onClick={() => handleRemoveGain(g.id)} style={{ marginLeft: '1rem' }}>🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  );

  function handleRemoveGain(id: string) {
    const updated = gains.filter((g) => g.id !== id);
    saveGains(updated);
    setGains(updated);
  }
}
