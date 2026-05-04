const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (user && user.password && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google Auth
router.post('/google', async (req, res) => {
  try {
    const { accessToken } = req.body;
    
    let email, name, googleId;

    if (accessToken.startsWith('mock_token_')) {
      // Development bypass mock
      email = accessToken.replace('mock_token_', '');
      name = email.split('@')[0];
      googleId = 'mock_google_id_' + name;
    } else {
      // Real Token Verification
      const { data } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      email = data.email;
      name = data.name;
      googleId = data.sub;
    }

    let user = await User.findOne({ email });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = 'google';
        await user.save();
      }
    } else {
      user = await User.create({ name, email, googleId, authProvider: 'google' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Google auth error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Google authentication failed', error: error.message });
  }
});

// Facebook Auth
router.post('/facebook', async (req, res) => {
  try {
    const { accessToken, userID } = req.body;
    
    // Real Token Verification
    const urlGraphFacebook = `https://graph.facebook.com/v12.0/${userID}/?fields=id,name,email&access_token=${accessToken}`;
    const { data } = await axios.get(urlGraphFacebook);
    const { email, name, id: facebookId } = data;

    if (!email) {
      return res.status(400).json({ message: 'Facebook account must have an email associated.' });
    }

    let user = await User.findOne({ email });

    if (user) {
      if (!user.facebookId) {
        user.facebookId = facebookId;
        user.authProvider = 'facebook';
        await user.save();
      }
    } else {
      user = await User.create({ name, email, facebookId, authProvider: 'facebook' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Facebook auth error:', error);
    res.status(500).json({ message: 'Facebook authentication failed', error: error.message });
  }
});

module.exports = router;
