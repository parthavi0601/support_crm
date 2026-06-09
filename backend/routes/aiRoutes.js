const express = require('express');
const router = express.Router();
const {
  generateSummary,
  suggestPriority,
  suggestResponse,
  categorizeTicket,
} = require('../services/aiService');

/**
 * POST /api/ai/analyze
 * Body: { subject, description, notes }
 * Returns: { summary, priority, response, category }
 */
router.post('/analyze', async (req, res) => {
  try {
    const { subject, description, notes = [] } = req.body;

    if (!subject || !description) {
      return res.status(400).json({ message: 'subject and description are required' });
    }

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      return res.status(503).json({ message: 'OpenAI API key not configured. Add OPENAI_API_KEY to your .env file.' });
    }

    // Run all 4 analyses in parallel for speed
    const [summary, priority, response, category] = await Promise.all([
      generateSummary(subject, description),
      suggestPriority(subject, description),
      suggestResponse(subject, description, notes),
      categorizeTicket(subject, description),
    ]);

    res.json({ summary, priority, response, category });
  } catch (error) {
    console.error('AI analyze error:', error.message);
    if (error.status === 401) {
      return res.status(401).json({ message: 'Invalid OpenAI API key. Please check your OPENAI_API_KEY.' });
    }
    if (error.status === 429) {
      return res.status(429).json({ message: 'OpenAI rate limit reached. Please wait a moment and try again.' });
    }
    res.status(500).json({ message: 'AI analysis failed: ' + error.message });
  }
});

module.exports = router;
