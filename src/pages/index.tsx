import { useEffect, useRef, useState } from 'react';
import { Gain } from '@/types/Gain';
import { loadGains, saveGains } from '@/utils/storage';
import { v4 as uuidv4 } from 'uuid';
import GainsChart from '@/components/GainsChart';

export default function Home() {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [month, setMonth] = useState('');
  const [gains, setGains] = useState<Gain[]>([]);
  const [editingGainId, setEditingGainId] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setGains(loadGains());
  }, []);

  function handleAddOrEditGain(e: React.FormEvent) {
    e.preventDefault();

    if (!category || !amount || !month) return;

    if (editingGainId) {
      const updated = gains.map((g) =>
        g.id === editingGainId
          ? { ...g, category, amount: parseFloat(amount), month }
          : g
      );
      saveGains(updated);
      setGains(updated);
      setEditingGainId(null);
    } else {
      const newGain: Gain = {
        id: uuidv4(),
        category,
        amount: parseFloat(amount),
        month,
      };
      const updated = [...gains, newGain];
      saveGains(updated);
      setGains(updated);
    }

    setCategory('');
    setAmount('');
    setMonth('');
  }

  function handleEditGain(gain: Gain) {
    setEditingGainId(gain.id);
    setCategory(gain.category);
    setAmount(gain.amount.toString());
    setMonth(gain.month);
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  function handleRemoveGain(id: string) {
    const confirmDelete = window.confirm('Tem certeza que deseja excluir este ganho?');
    if (!confirmDelete) return;

    const updated = gains.filter((g) => g.id !== id);
    saveGains(updated);
    setGains(updated);

    if (editingGainId === id) {
      setEditingGainId(null);
      setCategory('');
      setAmount('');
      setMonth('');
    }
  }


  const groupedByMonth = gains.reduce((acc, gain) => {
    if (!acc[gain.month]) acc[gain.month] = 0;
    acc[gain.month] += gain.amount;
    return acc;
  }, {} as { [month: string]: number });

  return (
    <div className="container" style={{ padding: '1rem' }}>
      <h1>Ganhos Mensais</h1>

      <form
        ref={formRef}
        onSubmit={handleAddOrEditGain}
        style={{
          marginBottom: '2rem',
          padding: '1rem',
          border: '1px solid #ccc',
          borderRadius: '8px',
          backgroundColor: editingGainId ? '#f9f9f9' : 'white',
        }}
      >
        <h3>{editingGainId ? 'Editando Ganho' : 'Novo Ganho'}</h3>

        <div>
          <label>Categoria:</label><br />
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Valor:</label><br />
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Mês:</label><br />
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            required
          />
        </div>

        <button type="submit" style={{ marginTop: '1rem' }}>
          {editingGainId ? 'Salvar Edição' : 'Adicionar Ganho'}
        </button>

        {editingGainId && (
          <button
            type="button"
            onClick={() => {
              setEditingGainId(null);
              setCategory('');
              setAmount('');
              setMonth('');
            }}
            style={{ marginLeft: '1rem' }}
          >
            Cancelar Edição
          </button>
        )}
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
      <ul style={{ fontSize: '0.9rem', listStyle: 'none', padding: 0, margin: 0 }}>
        {gains.map((g) => (
          <li
            key={g.id}
            style={{
              marginBottom: '0.75rem',
              borderBottom: '1px solid #eee',
              paddingBottom: '0.5rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',  // alinhamento vertical central
                width: '100%',         // garantir 100% da largura possível
              }}
            >
              {/* Conteúdo da esquerda ocupa o máximo */}
              <div style={{ flexGrow: 1, marginRight: '1rem' }}>
                <div>
                  <strong>{g.category}</strong>: R$ {g.amount.toFixed(2)}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>{g.month}</div>
              </div>

              {/* Botões à direita, sem margem interna */}
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                <button
                  onClick={() => handleEditGain(g)}
                  style={{
                    fontSize: '1.2rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    lineHeight: 1,
                  }}
                  title="Editar"
                  aria-label={`Editar ganho ${g.category} de ${g.month}`}
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleRemoveGain(g.id)}
                  style={{
                    fontSize: '1.2rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    lineHeight: 1,
                  }}
                  title="Excluir"
                  aria-label={`Excluir ganho ${g.category} de ${g.month}`}
                >
                  🗑️
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

    </div>
  );
}
