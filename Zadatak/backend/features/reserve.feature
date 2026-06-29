# features/reserve.feature
Feature: Registracija mjesta

  Scenario: Prijavljeni korisnik moze rezervirati i osloboditi mjesto
    Given otvorim stranicu "http://localhost:9000"
    When unesem email "test" i lozinku "test"
    And kliknem gumb "Login"
    Then trebam biti preusmjeren na "/parking"
    And vidim parking mjesta na stranici
    And rezerviram
    And vidim rezervaciju
    And oslobodim
    And vidim slobodno

  Scenario: Gost moze rezervirati i osloboditi mjesto
    Scenario: Gost može vidjeti parking mjesta
    Given otvorim stranicu "http://localhost:9000"
    And kliknem gumb "Continue as Guest"
    Then trebam biti preusmjeren na "/guest"
    And kliknem gumb "Nastavi kao gost"
    Then trebam biti preusmjeren na "/parking"
    And vidim parking mjesta na stranici
    And rezerviram
    And vidim rezervaciju
    And oslobodim
    And vidim slobodno