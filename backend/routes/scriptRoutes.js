const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const Script = require('../models/Script');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Get all scripts for logged in user
router.get('/', protect, async (req, res) => {
  try {
    const scripts = await Script.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(scripts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate and save new script
router.post('/generate', protect, async (req, res) => {
  try {
    const { topic, evidence, durationMinutes } = req.body;
    
    // Average speaking rate: 130 words per minute
    const targetWordCount = durationMinutes * 130;

    const prompt = `You are an expert scriptwriter. Using the following evidence: ${evidence}, generate a YouTube video script about "${topic}". The script must be exactly tailored for a ${durationMinutes}-minute video. Assume an average speaking rate of 130 words per minute, so the script should be approximately ${targetWordCount} words long. Provide ONLY the script content. Do not include introductory conversational text. Include stage directions like [Intro], [Main Point 1], etc.`;

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    const generatedText = response.text;
    const actualWordCount = generatedText.split(/\s+/).filter(word => word.length > 0).length;

    const script = await Script.create({
      user: req.user.id,
      topic,
      evidence,
      durationMinutes,
      content: generatedText,
      wordCount: actualWordCount
    });

    res.status(201).json(script);
  } catch (error) {
    console.error("AI Generation Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Update script
router.put('/:id', protect, async (req, res) => {
  try {
    const { content } = req.body;
    const wordCount = content.replace(/<[^>]+>/g, '').split(/\s+/).filter(word => word.length > 0).length; // strip HTML for word count
    
    const script = await Script.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { content, wordCount },
      { new: true }
    );
    
    if (!script) {
      return res.status(404).json({ message: 'Script not found' });
    }
    
    res.json(script);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete script
router.delete('/:id', protect, async (req, res) => {
  try {
    const script = await Script.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    
    if (!script) {
      return res.status(404).json({ message: 'Script not found' });
    }
    
    res.json({ message: 'Script removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
