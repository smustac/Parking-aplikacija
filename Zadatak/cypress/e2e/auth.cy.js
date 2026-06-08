// cypress/e2e/auth.cy.js
describe('Login stranica', () => {

  beforeEach(() => {
    cy.visit('/')
  })

  it('prikazuje login formu', () => {
    cy.contains('Prijava').should('be.visible')
    cy.contains('Dobrodošli').should('be.visible')
    cy.get('.q-input input[type="email"]').should('exist')
    cy.get('.q-input input[type="password"]').should('exist')
  })

  it('prikazuje grešku za prazna polja', () => {
    cy.contains('button', 'Login').click()
    cy.contains('Please fill in all fields').should('be.visible')
  })

  it('prikazuje grešku za krivi email/password', () => {
    cy.get('.q-input input[type="email"]').type('nepostoji@test.com')
    cy.get('.q-input input[type="password"]').type('krivaLozinka123')
    cy.contains('button', 'Login').click()
    cy.contains('Invalid email or password').should('be.visible')
  })

  it('redirect na /parking nakon uspješnog logina', () => {
    cy.get('.q-input input[type="email"]').type('test')
    cy.get('.q-input input[type="password"]').type('test')
    cy.contains('button', 'Login').click()
    cy.url().should('include', '/parking')
  })

  it('gumb Admin Access vodi na /adminlogin', () => {
    cy.contains('button', 'Admin Access').click()
    cy.url().should('include', '/adminlogin')
  })

  it('gumb Continue as Guest vodi na /guest', () => {
    cy.contains('button', 'Continue as Guest').click()
    cy.url().should('include', '/guest')
  })

})