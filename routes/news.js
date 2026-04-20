// routes/news.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

// GET: /api/news
router.get('/', async (req, res) => {
  try {
    const { category, q } = req.query;
    let url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_API_KEY}`;
    
    if (category && category !== 'general') url += `&category=${category}`;
    if (q) url += `&q=${encodeURIComponent(q)}`;

    const response = await axios.get(url);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching news:', error.message);
    res.status(500).json({ message: 'Error fetching news' });
  }
});

module.exports = router;