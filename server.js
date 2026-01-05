const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors()); // Allow your website to talk to this server
app.use(express.json());

// --- CONFIGURATION ---
const ADMIN_PASSWORD = "supersecretpassword"; // CHANGE THIS
const BIN_ID = "PASTE_YOUR_BIN_ID_HERE";
const API_KEY = "PASTE_YOUR_MASTER_KEY_HERE";
// ---------------------

// 1. GET: Website reads the message
app.get('/api/status', async (req, res) => {
  try {
    const response = await axios.get(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      headers: { 'X-Master-Key': API_KEY }
    });
    res.json(response.data.record);
  } catch (error) {
    res.status(500).json({ error: "Database Error" });
  }
});

// 2. POST: Admin updates the message
app.post('/api/update', async (req, res) => {
  const { password, message, color, active } = req.body;

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, error: "Wrong Password" });
  }

  try {
    await axios.put(`https://api.jsonbin.io/v3/b/${BIN_ID}`, 
      { message, color, active },
      { headers: { 
          'Content-Type': 'application/json',
          'X-Master-Key': API_KEY 
        }
      }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to save" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
