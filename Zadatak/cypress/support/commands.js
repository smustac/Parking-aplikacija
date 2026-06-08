// cypress/support/commands.js
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/')
  // Quasar q-input renderira native input unutar sebe
  cy.get('.q-input input[type="email"]').type(email)
  cy.get('.q-input input[type="password"]').type(password)
  cy.contains('button', 'Login').click()
  cy.url().should('include', '/parking')
})