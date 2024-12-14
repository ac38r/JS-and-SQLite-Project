// --- Dependencies ---
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const authRoutes = require('./routes/auth'); // Ensure this path is correct
const taskRoutes = require('./routes/tasks'); // Ensure this path is correct
const { authenticateToken } = require('./middleware/auth'); // Ensure this path is correct
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Use routes
app.use('/auth', authRoutes);
app.use('/api', authenticateToken, taskRoutes); // Use authenticateToken middleware

// Serve the index.html file for the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- Database Setup ---
const db = new sqlite3.Database('./db/tasks.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        title TEXT,
        description TEXT,
        due_date TEXT,
        status TEXT DEFAULT 'pending',
        FOREIGN KEY(user_id) REFERENCES users(id)
      )
    `);
  }
});

// --- Helper Functions ---
// --- API Endpoints ---
// Register a new user
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], function (err) {
    if (err) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    console.log(`User registered: ${username}`);
    res.status(201).json({ message: 'User registered successfully' });
  });
});

// Login user
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err || !user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  });
});

// Get tasks for authenticated user
app.get('/tasks', authenticateToken, (req, res) => {
  db.all('SELECT * FROM tasks WHERE user_id = ?', [req.user.id], (err, tasks) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch tasks' });
    }
    res.json(tasks);
  });
});

// Add a new task
app.post('/tasks', authenticateToken, (req, res) => {
  const { title, description, due_date } = req.body;
  if (!title || !due_date) {
    return res.status(400).json({ error: 'Title and due date are required' });
  }

  db.run(
    'INSERT INTO tasks (user_id, title, description, due_date) VALUES (?, ?, ?, ?)',
    [req.user.id, title, description, due_date],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to add task' });
      }
      res.status(201).json({ id: this.lastID, title, description, due_date, status: 'pending' });
    }
  );
});

// Update a task
app.put('/tasks/:id', authenticateToken, (req, res) => {
  const { title, description, due_date, status } = req.body;
  const { id } = req.params;

  db.run(
    'UPDATE tasks SET title = ?, description = ?, due_date = ?, status = ? WHERE id = ? AND user_id = ?',
    [title, description, due_date, status, id, req.user.id],
    function (err) {
      if (err || this.changes === 0) {
        return res.status(500).json({ error: 'Failed to update task or task not found' });
      }
      res.json({ message: 'Task updated successfully' });
    }
  );
});

// Delete a task
app.delete('/tasks/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM tasks WHERE id = ? AND user_id = ?', [id, req.user.id], function (err) {
    if (err || this.changes === 0) {
      return res.status(500).json({ error: 'Failed to delete task or task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  });
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

