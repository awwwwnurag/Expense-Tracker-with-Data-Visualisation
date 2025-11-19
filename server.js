const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://anuragaryan:Anurag2508@cluster.tcwxvpo.mongodb.net/?retryWrites=true&w=majority&appName=Clusterit', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('Could not connect to MongoDB Atlas', err));

// Define a schema for reset tokens
const resetTokenSchema = new mongoose.Schema({
  email: String,
  token: String,
  createdAt: { type: Date, default: Date.now, expires: 3600 } // Token expires after 1 hour
});

const ResetToken = mongoose.model('ResetToken', resetTokenSchema);

// Configure nodemailer (replace with your email service credentials)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com', // Replace with your email
    pass: 'your-password', // Replace with your password
  },
});

// Endpoint to handle password reset requests
app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;
  const token = crypto.randomBytes(20).toString('hex');

  // Save token to MongoDB
  const resetToken = new ResetToken({ email, token });
  await resetToken.save();

  const mailOptions = {
    from: 'your-email@gmail.com', // Replace with your email
    to: email,
    subject: 'Password Reset',
    text: `You are receiving this because you (or someone else) has requested the reset of the password for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process:\n\n
      http://localhost:3000/reset-password/${token}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send({ error: 'Error sending email' });
    }
    res.status(200).send({ message: 'Password reset email sent' });
  });
});

// Endpoint to reset password
app.post('/api/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  // Find token in MongoDB
  const resetToken = await ResetToken.findOne({ token });
  if (!resetToken) {
    return res.status(400).send({ error: 'Invalid or expired token' });
  }

  // Update password logic here (e.g., update in a database)
  // For now, we'll just delete the token
  await ResetToken.deleteOne({ token });
  res.status(200).send({ message: 'Password has been reset' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 