# features/auth.feature
Feature: Admin prijava i pregled korisnika

  Scenario: Uspješna prijava admina i pregled korisnika
    Given otvorim stranicu "http://localhost:9000"
    And kliknem gumb "Admin access"
    When unesem email "stipe.mu2004@gmail.com" i lozinku "123"
    And kliknem gumb "Login"
    Then trebam biti preusmjeren na "/adminpage"
    Then vidim korisnike
    Then kliknem gumb "Logout"

  Scenario: Uspješna promjena uloge korisnika
    Given otvorim stranicu "http://localhost:9000"
    And kliknem gumb "Admin access"
    When unesem email "stipe.mu2004@gmail.com" i lozinku "123"
    And kliknem gumb "Login"
    Then trebam biti preusmjeren na "/adminpage"
    Then vidim korisnike
    Then promjena uloge

  Scenario: Uspješno brisanje korisnika
    Given otvorim stranicu "http://localhost:9000"
    And kliknem gumb "Admin access"
    When unesem email "stipe.mu2004@gmail.com" i lozinku "123"
    And kliknem gumb "Login"
    Then trebam biti preusmjeren na "/adminpage"
    Then vidim korisnike
    Then obriši korisnika
