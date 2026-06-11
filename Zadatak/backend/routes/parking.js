import express from 'express'
import pool from '../db/connection.js'
import auth from '../../middleware/auth.js'

const router = express.Router()
router.use(auth)

const LIMIT_HOURS = 8

// GET /api/parking
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        ps.id,
        ps.type,
        CASE WHEN p.parking_id IS NULL THEN 0 ELSE 1 END AS taken,
        p.taken_at,
        p.user_id AS taken_by
      FROM parking_spots ps
      LEFT JOIN parking p
        ON p.parking_id = ps.id
       AND p.released_at IS NULL
       AND p.taken_at > DATE_SUB(NOW(), INTERVAL ? HOUR)
      ORDER BY ps.id
    `, [LIMIT_HOURS])
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Greška pri dohvaćanju parkinga' })
  }
})


// POST /api/parking/:id/occupy
router.post('/:id/occupy', async (req, res) => {
  const spotId = Number(req.params.id)
  const userId = req.user?.id
  const role   = req.user?.role || 'student'

  if (!userId || isNaN(Number(userId))) {
    return res.status(401).json({ message: 'Niste prijavljeni (gost se mora kreirati kroz Gost ulaz)' })
  }

  try {
    const [spotRows] = await pool.query('SELECT * FROM parking_spots WHERE id = ?', [spotId])
    if (spotRows.length === 0) return res.status(404).json({ message: 'Mjesto ne postoji' })
    const spot = spotRows[0]

    if (spot.type === 'vip'     && role !== 'vip')     return res.status(403).json({ message: 'Nemate pravo na VIP mjesto' })
    if (spot.type === 'invalid' && role !== 'invalid') return res.status(403).json({ message: 'Nemate pravo na invalid mjesto' })

    // limit 2 sata
    await pool.query(`
      UPDATE parking
         SET released_at = NOW()
       WHERE parking_id = ?
         AND released_at IS NULL
         AND taken_at <= DATE_SUB(NOW(), INTERVAL ? HOUR)
    `, [spotId, LIMIT_HOURS])

    // jel mjesto zauzeto
    const [busy] = await pool.query(`
      SELECT 1 FROM parking
       WHERE parking_id = ?
         AND released_at IS NULL
         AND taken_at > DATE_SUB(NOW(), INTERVAL ? HOUR)
       LIMIT 1
    `, [spotId, LIMIT_HOURS])
    if (busy.length) return res.status(400).json({ message: 'Mjesto je već zauzeto' })

    // ima li user vec mjesto
    const [active] = await pool.query(`
      SELECT 1 FROM parking
       WHERE user_id = ?
         AND released_at IS NULL
         AND taken_at > DATE_SUB(NOW(), INTERVAL ? HOUR)
       LIMIT 1
    `, [Number(userId), LIMIT_HOURS])
    if (active.length) return res.status(400).json({ message: 'Već imate zauzeto parking mjesto' })

    await pool.query(
      'INSERT INTO parking (user_id, parking_id, taken_at, released_at) VALUES (?, ?, NOW(), NULL)',
      [Number(userId), spotId]
    )

    res.json({ message: 'Parking mjesto zauzeto' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Greška pri zauzimanju parkinga' })
  }
})


// POST /api/parking/:id/release
router.post('/:id/release', async (req, res) => {
  const spotId = Number(req.params.id)
  const userId = req.user?.id

  if (!userId || isNaN(Number(userId))) {
    return res.status(401).json({ message: 'Niste prijavljeni' })
  }

  try {
    const [result] = await pool.query(
      `UPDATE parking
          SET released_at = NOW()
        WHERE parking_id = ?
          AND user_id = ?
          AND released_at IS NULL`,
      [spotId, Number(userId)]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Nemate aktivno zauzeće za ovo mjesto' })
    }

    res.json({ message: 'Parking mjesto oslobođeno' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Greška pri oslobađanju parkinga' })
  }
})

export default router