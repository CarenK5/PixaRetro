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

const storageSchema = new mongoose.Schema({
  key: { type: String, unique: true, required: true },
  value: mongoose.Schema.Types.Mixed
}, { timestamps: true });
const Storage = mongoose.models.Storage || mongoose.model('Storage', storageSchema);

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

const storageFile = path.join(__dirname, 'storage.json');
let storageData = {};

function loadStorageData() {
  try {
    if (fs.existsSync(storageFile)) {
      storageData = JSON.parse(fs.readFileSync(storageFile, 'utf8') || '{}');
    }
  } catch (error) {
    console.warn('Could not load storage data:', error.message);
    storageData = {};
  }
}

function saveStorageData() {
  try {
    fs.writeFileSync(storageFile, JSON.stringify(storageData, null, 2), 'utf8');
  } catch (error) {
    console.warn('Could not save storage data:', error.message);
  }
}

loadStorageData();

app.get('/api/storage', async (req, res) => {
  const prefix = req.query.prefix || '';

  if (mongoConnected) {
    const regex = new RegExp('^' + prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const docs = await Storage.find({ key: { $regex: regex } }).select('key').lean();
    return res.json(docs.map((doc) => doc.key));
  }

  const keys = Object.keys(storageData).filter((key) => key.startsWith(prefix));
  res.json(keys);
});

app.get('/api/storage/:key', async (req, res) => {
  const key = decodeURIComponent(req.params.key);

  if (mongoConnected) {
    const doc = await Storage.findOne({ key }).lean();
    return res.json({ key, value: doc ? doc.value : null });
  }

  const value = key in storageData ? storageData[key] : null;
  res.json({ key, value });
});

app.put('/api/storage/:key', async (req, res) => {
  const key = decodeURIComponent(req.params.key);

  if (mongoConnected) {
    await Storage.updateOne({ key }, { key, value: req.body }, { upsert: true });
    return res.json({ ok: true });
  }

  storageData[key] = req.body;
  saveStorageData();
  res.json({ ok: true });
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
