// tests/unit/auth.test.js

// Testiramo čistu logiku, bez baze

describe('Register validacija', () => {

  function validateRegister({ username, email, password }) {
    if (!username || !email || !password) {
      return { valid: false, message: 'All fields are required' }
    }
    if (!email.includes('@')) {
      return { valid: false, message: 'Invalid email' }
    }
    return { valid: true }
  }

  test('vraća grešku ako nedostaje username', () => {
    const result = validateRegister({ username: '', email: 'a@b.com', password: '123' })
    expect(result.valid).toBe(false)
    expect(result.message).toBe('All fields are required')
  })

  test('vraća grešku ako nedostaje email', () => {
    const result = validateRegister({ username: 'Pero', email: '', password: '123' })
    expect(result.valid).toBe(false)
  })

  test('vraća grešku za neispravan email', () => {
    const result = validateRegister({ username: 'Pero', email: 'nije-email', password: '123' })
    expect(result.valid).toBe(false)
  })

  test('prolazi za ispravne podatke', () => {
    const result = validateRegister({ username: 'Pero', email: 'pero@test.com', password: 'pass123' })
    expect(result.valid).toBe(true)
  })

})