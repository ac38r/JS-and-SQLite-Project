const express = require('express');
const db = require('../models/database');
const { authenticateToken } = require('../middleware/auth'); // Ensure this is imported correctly
const router = express.Router();

router.get('/tasks', authenticateToken, (req, res) => {
    db.all('SELECT * FROM tasks WHERE user_id = ?', [req.user.id], (err, tasks) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch tasks' });
        }
        res.json(tasks);
    });
});

router.post('/tasks', authenticateToken, (req, res) => {
    const { title, description, due_date } = req.body;
    if (!title || !due_date) {
        return res.status(400).json({ error: 'Title and due date are required' });
    }

    db.run('INSERT INTO tasks (user_id, title, description, due_date) VALUES (?, ?, ?, ?)', [req.user.id, title, description, due_date], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Failed to add task' });
        }
        res.status(201).json({ id: this.lastID, title, description, due_date, status: 'pending' });
    });
});

router.put('/tasks/:id', authenticateToken, (req, res) => {
    const { title, description, due_date, status } = req.body;
    const { id } = req.params;

    db.run('UPDATE tasks SET title = ?, description = ?, due_date = ?, status = ? WHERE id = ? AND user_id = ?', [title, description, due_date, status, id, req.user.id], function (err) {
        if (err || this.changes === 0) {
            return res.status(500).json({ error: 'Failed to update task or task not found' });
        }
        res.json({ message: 'Task updated successfully' });
    });
});

router.delete('/tasks/:id', authenticateToken, (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM tasks WHERE id = ? AND user_id = ?', [id, req.user.id], function (err) {
        if (err || this.changes === 0) {
            return res.status(500).json({ error: 'Failed to delete task or task not found' });
        }
        res.json({ message: 'Task deleted successfully' });
    });
});

module.exports = router;
