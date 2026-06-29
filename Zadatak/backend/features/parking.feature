# features/parking.feature
Feature: Pregled parking mjesta

  Scenario: Prijavljeni korisnik vidi parking mjesta
    Given otvorim stranicu "http://localhost:9000"
    When unesem email "test" i lozinku "test"
    And kliknem gumb "Login"
    Then trebam biti preusmjeren na "/parking"
    And vidim parking mjesta na stranici

  Scenario: Gost može vidjeti parking mjesta
    Given otvorim stranicu "http://localhost:9000"
    And kliknem gumb "Continue as Guest"
    Then trebam biti preusmjeren na "/guest"
    And kliknem gumb "Nastavi kao gost"
    Then trebam biti preusmjeren na "/parking"