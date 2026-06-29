# features/admin.feature
Feature: Registracija

  Scenario: Uspješna registracija
    Given otvorim stranicu "http://localhost:9000/#/register" 
    When unesem username "acep" i email "acep.test@gmail.com" i lozinku "123"
    And kliknem gumb "Register"
    Then vidim poruku "User registered successfully"

  