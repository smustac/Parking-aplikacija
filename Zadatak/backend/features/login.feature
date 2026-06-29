# features/auth.feature
Feature: Korisnička prijava i registracija

  Scenario: Uspješna prijava korisnika
    Given otvorim stranicu "http://localhost:9000"
    When unesem email "test" i lozinku "test"
    And kliknem gumb "Login"
    Then trebam biti preusmjeren na "/parking"

