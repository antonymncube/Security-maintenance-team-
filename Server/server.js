const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const axios = require('axios');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3001;

const BASE_USERS_URL = 'http://localhost:3000/Users/forgotPassword';

const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

const hashPassword = async (password) => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

const getUserDetails = async (email) => {
  try {
    const response = await axios.get(`${BASE_USERS_URL}`);
    const users = response.data;

    return users.find((user) => user.email === email);
  } catch (error) {
    console.error('Error fetching user details:', error.message);
    throw error;
  }
};

app.use(bodyParser.json());
app.use(cors());

app.post('/forgot_password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await getUserDetails(email);

    if (user) {
      const resetToken = generateToken();
      const hashedToken = await hashPassword(resetToken);
      user.resetToken = hashedToken;
      user.resetTokenExpiration = new Date(Date.now() + 3600000);

      res.json({ message: 'Password reset email sent successfully.', userExists: true, token: resetToken });
    } else {
      res.status(404).json({ error: 'User not found.' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.post('/reset_password', async (req, res) => {
  const { email, token, newPassword } = req.body;

  try {
    const user = await getUserDetails(email);

    if (user && (await bcrypt.compare(token, user.resetToken)) && user.resetTokenExpiration > new Date()) {
      const hashedPassword = await hashPassword(newPassword);
      user.password = hashedPassword;
      user.resetToken = null;
      user.resetTokenExpiration = null;

      res.json({ message: 'Password reset successfully.' });
    } else {
      res.status(400).json({ error: 'Invalid or expired token.' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
