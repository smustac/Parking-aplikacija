# features/auth.feature
Feature: Korisnička prijava i registracija

  Scenario: Uspješna prijava korisnika
    Given otvorim stranicu "http://localhost:9000"
    When unesem email "test" i lozinku "test"
    And kliknem gumb "Login"
    Then trebam biti preusmjeren na "/parking"

  Scenario: Prijava s krivim podacima
    Given otvorim stranicu "http://localhost:9000"
    When unesem email "netocni@test.com" i lozinku "krivaLozinka"
    And kliknem gumb "Login"
    Then vidim poruku "Invalid email or password"

  Scenario: Prazna polja pri prijavi
    Given otvorim stranicu "http://localhost:9000"
    And kliknem gumb "Login"
    Then vidim poruku "Please fill in all fields"

  Scenario: Uspješna registracija novog korisnika
    Given otvorim stranicu "http://localhost:9000/#/register"
    When unesem username "User"
    And unesem email "novi" i lozinku "pass"
    And kliknem gumb "Register"
    Then vidim poruku "User registered successfully"