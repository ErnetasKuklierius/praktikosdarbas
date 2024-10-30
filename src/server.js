const express = require('express');
const app = express();
const db = require('./db');
const PORT = 3001;
const cors = require('cors');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());


app.get('/api/users', async (req, res) => {
  try {
    const [users] = await db.execute('SELECT * FROM users');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error fetching users' });
  }
});


app.post('/api/users', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);

    if (rows && rows.length > 0) {
      const user = rows[0];
      const isValidPassword = password === user.password;

      if (isValidPassword) {
        return res.status(200).json({ message: 'Login successful', role: user.role });
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

app.post('/api/users/block', async (req, res) => {
  const { id, action } = req.body;

  if (!id || !action) {
    return res.status(400).json({ error: 'User ID and action are required' });
  }

  try {
    if (action === 'block') {
      await db.execute('UPDATE users SET isBlocked = 1 WHERE id = ?', [id]);
      res.status(200).json({ message: 'User blocked successfully' });
    } else if (action === 'unblock') {
      await db.execute('UPDATE users SET isBlocked = 0 WHERE id = ?', [id]);
      res.status(200).json({ message: 'User unblocked successfully' });
    } else {
      return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('Error blocking/unblocking user:', error);
    res.status(500).json({ error: 'Database error' });
  }
});


app.post('/api/events', upload.single('picture'), async (req, res) => {
  const { title, events_data, location, category } = req.body;
  const picture = req.file;

  try {
    if (!title || !events_data || !location || !category || !picture) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const [result] = await db.execute(
      'INSERT INTO events (title, events_data, location, picture, category) VALUES (?, ?, ?, ?, ?)',
      [title, events_data, location, picture.filename, category]
    );
    res.status(201).json({ message: 'Event added successfully', eventId: result.insertId });
  } catch (error) {
    console.error('Error adding event:', error);
    res.status(500).json({ error: 'Error adding event' });
  }
});

app.post('/api/categories', async (req, res) => {
  const { name } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }a

    const [result] = await db.execute('INSERT INTO categories (name) VALUES (?)', [name]);
    res.status(201).json({ message: 'Category added successfully', categoryId: result.insertId });
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ error: 'Error adding category' });
  }
});

app.get('/api/events', async (req, res) => {
  try {
    const [events] = await db.execute('SELECT * FROM events WHERE isApproved IS NULL OR isApproved = 1');
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Error fetching events' });
  }
});

app.post('/api/events/approve', async (req, res) => {
  const { eventId } = req.body;

  if (!eventId) {
    return res.status(400).json({ error: 'Event ID is required' });
  }

  try {
    await db.execute('UPDATE events SET isApproved = 1 WHERE id = ?', [eventId]);
    res.status(200).json({ message: 'Event approved successfully' });
  } catch (error) {
    console.error('Error approving event:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/events/reject', async (req, res) => {
  const { eventId } = req.body;

  if (!eventId) {
    return res.status(400).json({ error: 'Event ID is required' });
  }

  try {
    await db.execute('UPDATE events SET isApproved = 0 WHERE id = ?', [eventId]);
    res.status(200).json({ message: 'Event rejected successfully' });
  } catch (error) {
    console.error('Error rejecting event:', error);
    res.status(500).json({ error: 'Database error' });
  }
});


app.get('/api/categories', async (req, res) => {
  try {
    const [categories] = await db.execute('SELECT * FROM categories');
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Error fetching categories' });
  }
});

app.get('/api/blocked-users', async (req, res) => {
  try {
    const [blockedUsers] = await db.execute('SELECT * FROM users WHERE isBlocked = 1');
    res.json(blockedUsers);
  } catch (error) {
    console.error('Error fetching blocked users:', error);
    res.status(500).json({ error: 'Error fetching blocked users' });
  }
});

app.put('/api/events/:id', async (req, res) => {
  const { id } = req.params;
  const { title, events_data, location, picture, category } = req.body;

  if (!title || !events_data || !location || !category) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const [result] = await db.execute(
      'UPDATE events SET title = ?, events_data = ?, location = ?, picture = ?, category = ? WHERE id = ?',
      [title, events_data, location, picture, category, id]
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
    const [result] = await db.execute('DELETE FROM events WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ message: 'Event deleted' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Error deleting event' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
