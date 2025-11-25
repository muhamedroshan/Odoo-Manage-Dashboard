const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { exec, spawn } = require('child_process');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

// --- Middleware: Verify Token ---
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send("Token required");
  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};

// --- Auth Routes ---
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return res.json({ token });
  }
  res.status(401).json({ message: "Invalid credentials" });
});

// --- Dashboard: Scripts ---
app.post('/api/execute', verifyToken, (req, res) => {
  const { type } = req.body;
  let scriptPath = "";
  
  if (type === 'pull') scriptPath = process.env.SCRIPT_PULL;
  if (type === 'restart') scriptPath = process.env.SCRIPT_RESTART;

  if (!scriptPath) return res.status(400).json({ message: "Unknown script type" });

  exec(`sh ${scriptPath}`, (error, stdout, stderr) => {
    if (error) {
      return res.json({ success: false, output: stderr || error.message });
    }
    res.json({ success: true, output: stdout });
  });
});

// --- Backups Routes ---
app.get('/api/backups', verifyToken, (req, res) => {
  const dir = process.env.BACKUP_DIR;
  if (!fs.existsSync(dir)) return res.json([]);

  const files = fs.readdirSync(dir).map(file => {
    const stat = fs.statSync(path.join(dir, file));
    return {
      name: file,
      date: stat.mtime,
      size: stat.size
    };
  }).sort((a, b) => b.date - a.date); // Newest first

  res.json(files);
});

app.get('/api/backups/download/:filename', verifyToken, (req, res) => {
    const filePath = path.join(process.env.BACKUP_DIR, req.params.filename);
    if(fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).send("File not found");
    }
});

// --- WebSocket: Live Logs ---
// Tail the log file effectively
const tailLogs = () => {
    const logPath = process.env.LOG_FILE_PATH;
    if (!fs.existsSync(logPath)) fs.writeFileSync(logPath, ""); // Create if missing

    // Use tail -f logic (works best on Linux/Mac)
    const tail = spawn('tail', ['-f', '-n', '20', logPath]);

    tail.stdout.on('data', (data) => {
        io.emit('log_update', data.toString());
    });

    tail.stderr.on('data', (data) => {
        io.emit('log_update', `[SYSTEM ERROR]: ${data.toString()}`);
    });
};

tailLogs();

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});