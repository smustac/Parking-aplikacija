// cypress/e2e/register.cy.js
describe('Register stranica', () => {

  beforeEach(() => {
    cy.visit('/register')
    cy.contains('button', 'Registracija').click()
  })

  it('prikazuje register formu', () => {
    cy.contains('Napravi profil').should('be.visible')
    cy.get('.q-input input[type="text"]').should('exist')
    cy.get('.q-input input[type="email"]').should('exist')
    cy.get('.q-input input[type="password"]').should('exist')
  })

  it('prikazuje grešku za prazna polja', () => {
    cy.contains('button', 'Register').click()
    cy.contains('Please fill in all fields').should('be.visible')
  })

  it('prikazuje grešku ako nedostaje samo username', () => {
    cy.get('.q-input input[type="email"]').type('test@test.com')
    cy.get('.q-input input[type="password"]').type('pass123')
    cy.contains('button', 'Register').click()
    cy.contains('Please fill in all fields').should('be.visible')
  })

  it('prikazuje grešku za već postojeći email', () => {
    cy.get('.q-input input[type="text"]').type('test')
    cy.get('.q-input input[type="email"]').type('test')
    cy.get('.q-input input[type="password"]').type('pass123')
    cy.contains('button', 'Register').click()
    cy.contains('Username or email already exists').should('be.visible')
  })

  it('uspješna registracija prikazuje poruku', () => {
    const unique = Date.now() // osigurava unique username/email svaki put
    cy.get('.q-input input[type="text"]').type(`User${unique}`)
    cy.get('.q-input input[type="email"]').type(`user${unique}@test.com`)
    cy.get('.q-input input[type="password"]').type('pass123')
    cy.contains('button', 'Register').click()
    cy.contains('User registered successfully').should('be.visible')
  })

  it('checkbox Invalid mijenja rolu', () => {
    const unique = Date.now()
    cy.get('.q-input input[type="text"]').type(`Invalid${unique}`)
    cy.get('.q-input input[type="email"]').type(`invalid${unique}@test.com`)
    cy.get('.q-input input[type="password"]').type('pass123')
    cy.get('.q-checkbox').click() // označi Invalid checkbox
    cy.contains('button', 'Register').click()
    cy.contains('User registered successfully').should('be.visible')
  })

  it('forma se resetira nakon uspješne registracije', () => {
    const unique = Date.now()
    cy.get('.q-input input[type="text"]').type(`Reset${unique}`)
    cy.get('.q-input input[type="email"]').type(`reset${unique}@test.com`)
    cy.get('.q-input input[type="password"]').type('pass123')
    cy.contains('button', 'Register').click()
    cy.contains('User registered successfully').should('be.visible')
    // polja trebaju biti prazna
    cy.get('.q-input input[type="text"]').should('have.value', '')
    cy.get('.q-input input[type="email"]').should('have.value', '')
  })

})