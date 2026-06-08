import express from 'express'
import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'
import cors from 'cors'
import dotenv from 'dotenv'
import parkingRoutes from './routes/parking.js'
import guestRoutes from './routes/guest.js'
import { adminAuth } from './middleware2/adminAuth.js';
import jwt from 'jsonwebtoken'


dotenv.config()
const app = express()
app.use(cors()) 
app.use(express.json())

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
})


app.post('/api/register', async (req, res) => { 
  const { username, email, password, role } = req.body
  console.log('Register request body:', req.body)

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  try {
    // Check duplicates
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    )
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Username or email already exists' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert user with role
    await pool.query(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, role]
    )

    res.status(201).json({ message: 'User registered successfully' })
  } catch (err) {
    console.error('Registration error:', err)
    res.status(500).json({ message: 'Registration failed' })
  }
})



app.post('/api/login', async (req, res) => {
  const { email, password } = req.body
  console.log('Login request body:', req.body)

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email])
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const user = rows[0]
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        isGuest: false
      }
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ message: 'Login failed' })
  }
}) 



app.post('/api/admin-login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Admin login request body:', req.body);

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ? AND role = ?', [email,'admin']);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const admin = rows[0];
    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // stvori token
    const token = jwt.sign(
      { id: admin.id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    // vrati token sa info
    res.json({
      message: 'Login successful',
      admin: { id: admin.id, username: admin.username, email: admin.email },
      token
    });

  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ message: 'Admin login failed' });
  }
})


app.get('/api/users',adminAuth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, username, email, role FROM users'); 
    res.json(rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// DELETE a user by ID
app.delete('/api/users/:id',adminAuth, async (req, res) => {
  const { id } = req.params
  try {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id])
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json({ message: 'User deleted successfully' })
  } catch (err) {
    console.error('Delete user error:', err)
    res.status(500).json({ message: 'Failed to delete user' })
  }
})

// Update user role

app.put('/api/users/:id/role',adminAuth, async (req, res) => {
  const { id } = req.params
  const { role } = req.body

  if (!role) return res.status(400).json({ message: 'Role is required' })

  try {
    const [result] = await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, id])
    if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' })
    res.json({ message: 'Role updated successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to update role' })
  }
})

app.use('/api/parking', parkingRoutes)
app.use('/api/guest', guestRoutes)



if (process.env.NODE_ENV !== 'test') {
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
  })
}

export default app   
