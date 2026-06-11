import express from 'express'
import pool from '../db/connection.js'

const router = express.Router()

// POST /api/guest  { guest_token }
router.post('/', async (req, res) => {
  try {
    const { guest_token } = req.body || {}
    console.log('POST /api/guest body:', req.body)

    if (!guest_token) {
      return res.status(400).json({ message: 'guest_token missing' })
    }

    const [rows] = await pool.query(
      'SELECT id, username, role FROM users WHERE guest_token = ? LIMIT 1',
      [guest_token]
    )

    if (rows.length) {
      return res.json({
        user: { id: rows[0].id, username: rows[0].username, role: 'guest', isGuest: true }
      })
    }

    const rnd = Math.random().toString(36).slice(2, 8)
    const username = `guest_${rnd}`
    const email = `${username}@guest.local`

    const [result] = await pool.query(
      `INSERT INTO users (username, email, password, role, created_at, guest_token)
       VALUES (?, ?, '-', 'guest', NOW(), ?)`,
      [username, email, guest_token]
    )

    return res.json({
      user: { id: result.insertId, username, role: 'guest', isGuest: true }
    })
  } catch (err) {
    console.error('POST /api/guest error:', err)
    return res.status(500).json({ message: 'guest api failed' })
  }
})

// DELETE /api/guest { guest_token }
router.delete('/', async (req, res) => {
  try {
    const { guest_token } = req.body || {}
    console.log('DELETE /api/guest body:', req.body)

    if (!guest_token) {
      return res.status(400).json({ message: 'guest_token missing' })
    }

    const [rows] = await pool.query(
      'SELECT id FROM users WHERE guest_token = ? AND role = "guest" LIMIT 1',
      [guest_token]
    )

    if (!rows.length) {
      return res.status(404).json({ message: 'Guest not found' })
    }

    const guestId = rows[0].id

    await pool.query(
      'UPDATE parking SET released_at = NOW() WHERE user_id = ? AND released_at IS NULL',
      [guestId]
    )
    await pool.query('DELETE FROM parking WHERE user_id = ?', [guestId])
    await pool.query('DELETE FROM users WHERE id = ?', [guestId])

    return res.json({ ok: true })
  } catch (err) {
    console.error('DELETE /api/guest error:', err)
    return res.status(500).json({ message: 'Failed to delete guest' })
  }
})

export default router
