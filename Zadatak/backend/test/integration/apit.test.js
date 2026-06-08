import request from 'supertest'
import app from '../../server.js'

describe('POST /api/register', () => {

  test('400 ako nedostaju polja', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({ username: 'Pero' }) // nema email ni password

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('All fields are required')
  })

})

describe('POST /api/login', () => {

  test('400 ako nedostaju polja', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({}) // prazno

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('All fields are required')
  })

})

describe('POST /api/admin-login', () => {

  test('400 ako nedostaju polja', async () => {
    const res = await request(app)
      .post('/api/admin-login')
      .send({})

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('All fields are required')
  })

})

describe('GET /api/users', () => {

  test('401 bez admin tokena', async () => {
    const res = await request(app)
      .get('/api/users')
      // nema Authorization header

    expect(res.status).toBe(401)
  })

  test('401 s krivim tokenom', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', 'Bearer krivi-token-123')

    expect(res.status).toBe(401)
  })

})