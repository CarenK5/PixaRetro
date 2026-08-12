import { useEffect, useState } from 'react';
import './index.css';

export default function App() {
  const [creators, setCreators] = useState([]);
  const [form, setForm] = useState({ name: '', specialty: '', city: '', rate: '', status: 'Available' });
  const [message, setMessage] = useState('');

  async function loadCreators() {
    const res = await fetch('/api/creators');
    const data = await res.json();
    setCreators(data);
  }

  useEffect(() => {
    loadCreators();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch('/api/creators', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (res.ok) {
      setMessage(`Saved ${data.name}`);
      setForm({ name: '', specialty: '', city: '', rate: '', status: 'Available' });
      loadCreators();
    } else {
      setMessage(data.error || 'Could not save creator');
    }
  }

  return (
    <div className="app-shell">
      <header>
        <h1>PixaRetro Local</h1>
        <p>React + Express + MongoDB-ready local app</p>
      </header>

      <main>
        <section className="panel">
          <h2>Add a creator</h2>
          <form onSubmit={handleSubmit}>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" required />
            <input value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} placeholder="Specialty" required />
            <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="City" required />
            <input value={form.rate} type="number" onChange={(e) => setForm({ ...form, rate: e.target.value })} placeholder="Rate" required />
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="Available">Available</option>
              <option value="Booked">Booked</option>
            </select>
            <button type="submit">Save creator</button>
          </form>
          {message && <p className="message">{message}</p>}
        </section>

        <section className="panel">
          <h2>Creators</h2>
          <div className="card-list">
            {creators.map((creator) => (
              <article key={creator.id || creator._id} className="card">
                <h3>{creator.name}</h3>
                <p>{creator.specialty}</p>
                <p>{creator.city}</p>
                <p>Rate: ${creator.rate}</p>
                <p>Status: {creator.status}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
