const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let mongoConnected = false;
const fallbackCreators = [
  { id: '1', name: 'Mina Chen', specialty: 'Editorial Portraits', city: 'Seattle', rate: 280, status: 'Available' },
  { id: '2', name: 'Jules Rivera', specialty: 'Product Video', city: 'Austin', rate: 360, status: 'Booked' }
];

const creatorSchema = new mongoose.Schema({
  name: String,
  specialty: String,
  city: String,
  rate: Number,
  status: String
}, { timestamps: true });

const Creator = mongoose.models.Creator || mongoose.model('Creator', creatorSchema);

async function connectToDatabase() {
  if (!process.env.MONGODB_URI) {
    console.warn('No MONGODB_URI set. Running with in-memory demo data.');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 2500 });
    mongoConnected = true;
    console.log('MongoDB connected.');
  } catch (error) {
    console.warn('MongoDB unavailable, using in-memory data:', error.message);
  }
}

connectToDatabase();

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, mongoConnected });
});

app.get('/api/creators', async (_req, res) => {
  if (mongoConnected) {
    const creators = await Creator.find().sort({ createdAt: -1 }).lean();
    return res.json(creators);
  }

  res.json(fallbackCreators);
});

app.post('/api/creators', async (req, res) => {
  const { name, specialty, city, rate, status } = req.body;

  if (!name || !specialty || !city || !rate) {
    return res.status(400).json({ error: 'Please fill in name, specialty, city, and rate.' });
  }

  const payload = {
    name,
    specialty,
    city,
    rate: Number(rate),
    status: status || 'Available'
  };

  if (mongoConnected) {
    const created = await Creator.create(payload);
    return res.status(201).json(created);
  }

  const created = { id: String(Date.now()), ...payload };
  fallbackCreators.unshift(created);
  return res.status(201).json(created);
});

const publicDir = path.join(__dirname, 'public');
const legacyAssetsDir = path.join(__dirname, '..', 'Pixaretro_files');

app.use(express.static(publicDir));
app.use(express.static(legacyAssetsDir));

app.get('/', (_req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Not found' });
  }

  const indexPath = path.join(publicDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }

  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Local server ready at http://localhost:${port}`);
});
