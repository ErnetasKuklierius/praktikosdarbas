const express = require('express');
const app = express();
const db = require('./db');
const PORT = 5000;
const cors = require('cors');
app.use(cors());


app.use(express.json());

app.post('/api/events', async (req, res) => {
  const { title, description, date } = req.body;
  try {
    const [result] = await db.execute(
      'INSERT INTO events (title, description, date) VALUES (?, ?, ?)',
      [title, description, date]
    );
    res.status(201).json({ message: 'Event added successfully', eventId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Error adding event' });
  }
});

app.get('/api/events', async (req, res) => {
  try {
    const [events] = await db.execute('SELECT * FROM events');
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching events' });
  }
});

app.put('/api/events/:id/approve', async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute('UPDATE events SET isApproved = true WHERE id = ?', [id]);
    res.json({ message: 'Event approved' });
  } catch (error) {
    res.status(500).json({ error: 'Error approving event' });
  }
});


app.delete('/api/events/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute('DELETE FROM events WHERE id = ?', [id]);
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting event' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
