// server.js
const express = require('express');
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Load environment variables
dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Allows server to accept JSON data from the frontend
app.use(express.static(path.join(__dirname, 'public'))); // Serves your HTML files

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch((err) => console.error('MongoDB connection error:', err));
  // Quick test model
// const testSchema = new mongoose.Schema({ test: String });
// const Test = mongoose.model('Test', testSchema);

// const testDoc = new Test({ test: 'FinanceForge connected successfully!' });
// testDoc.save()
//   .then(doc => {
//     console.log('✅ Test document saved:', doc._id);
//     Test.find({}).then(tests => console.log('All tests:', tests.length));
//   })
//   .catch(err => console.error('Test failed:', err));

// Import Routes
const authRoutes = require('./routes/auth');
const newsRoutes = require('./routes/news');
const valRoutes = require('./routes/valuation');
// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/valuation', valRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`FinanceForge Server is running on ${PORT}`);
});