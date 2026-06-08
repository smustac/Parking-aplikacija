# features/admin.feature
Feature: Admin prijava

  Scenario: Uspješna admin prijava
    Given otvorim stranicu "http://localhost:9000/#/adminlogin"
    When unesem email "stipe.mu2004@gmail.com" i lozinku "123"
    And kliknem gumb "Login"
    Then trebam biti preusmjeren na "/adminpage"

  Scenario: Admin prijava s krivim podacima
    Given otvorim stranicu "http://localhost:9000/#/adminlogin"
    When unesem email "admin@parking.hr" i lozinku "krivaLozinka"
    And kliknem gumb "Login"
    Then vidim poruku "Invalid email or password"