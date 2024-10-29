const express = require('express');
const app = express();
const db = require('./db');
const PORT = 3001;
const cors = require('cors');

app.use(cors());
app.use(express.json());



app.post('/api/users', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [user] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
    const [password] = await db.execute('SELECT * FROM users WHERE password = ?', [password]);

    if (user.length > 0) {
      const isValidPassword = password === user[0].password;

      if (isValidPassword) {
        return res.status(200).json({ message: 'Login successful', role: user[0].role });
      } else {
        return res.status(401).json({ error: 'Invalid username or password' });
      }
    } else {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});



app.post('/api/events', async (req, res) => {
  const { title, description, events_data } = req.body;  
  try {
    const [result] = await db.execute(
      'INSERT INTO events (title, description, events_data) VALUES (?, ?, ?)',
      [title, description, events_data]
    );
    res.status(201).json({ message: 'Event added successfully', eventId: result.insertId });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Error fetching events' });
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

app.put('/api/events/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, events_data } = req.body;

  console.log('Request body:', req.body);

  console.log("Request parameters and body data:");
  console.log("ID:", id);
  console.log("Title:", title);
  console.log("Description:", description);
  console.log("Date:", events_data);

  if (!title || !description || !events_data || !id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const [result] = await db.execute(
      'UPDATE events SET title = ?, description = ?, events_data = ? WHERE id = ?',
      [title, description, events_data, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ message: 'Event updated successfully' });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Error updating event' });
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
