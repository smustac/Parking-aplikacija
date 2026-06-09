@echo off
title Parking Aplikacija - Instalacija

echo ================================================
echo   PARKING APLIKACIJA - Instalacijska skripta
echo ================================================
echo.

:: 5.2.1. PROVJERA PREDUVJETA
echo [1/6] Provjera preduvjeta...
echo.

node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [GRESKA] Node.js nije instaliran!
    echo Preuzmite sa: https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js instaliran.



call npm --version >nul 2>&1


git --version >nul 2>&1
if not errorlevel 1 (
    echo [OK] Git instaliran.
) else (
    echo [UPOZORENJE] Git nije instaliran.
)
echo.

:: 5.2.2. DB SERVER
echo [2/6] Provjera DB konekcije (AWS RDS)...
echo.
echo [INFO] Baza podataka je na AWS RDS serveru.
echo [INFO] Host: database-1.c494wsayuezu.us-east-1.rds.amazonaws.com
echo [INFO] Lokalna instalacija DB servera nije potrebna.
echo.

:: 5.2.3. INSTALACIJA DB KONEKTORA
echo [3/6] Instalacija DB konektora (mysql2)...
echo.
if not exist "backend" (
    echo [GRESKA] backend folder nije pronadjen!
    echo Pokrenite skriptu iz root foldera projekta.
    pause
    exit /b 1
)
cd backend
echo [INFO] Instaliram backend pakete...
call npm install
if %errorlevel% neq 0 (
    echo [GRESKA] Backend npm install nije uspio!
    pause
    exit /b 1
)
echo [OK] mysql2 konektor instaliran.
cd ..
echo.

:: 5.2.4. POSTAVLJANJE BAZE PODATAKA
echo [4/6] Postavljanje baze podataka...
echo.

if not exist "backend\.env" (
    echo [INFO] Kreiram backend\.env datoteku...
    echo DB_HOST=database-1.c494wsayuezu.us-east-1.rds.amazonaws.com> backend\.env
    echo DB_USER=smustac>> backend\.env
    echo DB_PASS=T1r2O3L.>> backend\.env
    echo DB_NAME=smustac>> backend\.env
    echo JWT_SECRET=ijustbipped67>> backend\.env
    echo PORT=3000>> backend\.env
    echo [OK] .env datoteka kreirana.
) else (
    echo [OK] .env datoteka vec postoji.
)

if exist "backend\db\init.sql" (
    echo [INFO] init.sql pronadjen.
    mysql --version >nul 2>&1
    if %errorlevel% equ 0 (
        echo [INFO] Pokretanje init.sql...
        mysql -h database-1.c494wsayuezu.us-east-1.rds.amazonaws.com -u smustac -pT1r2O3L. smustac < backend\db\init.sql
        echo [OK] Baza inicijalizirana.
    ) else (
        echo [INFO] MySQL klijent nije instaliran - init.sql pokrenite rucno.
    )
) else (
    echo [OK] Baza podataka vec konfigurirana na AWS RDS.
)
echo.

:: 5.2.5. INSTALACIJA SOFTVERA
echo [5/6] Instalacija softvera...
echo.

echo [INFO] Instaliram Quasar CLI...
call npm install -g @quasar/cli >nul 2>&1
if %errorlevel% neq 0 (
    echo [UPOZORENJE] Quasar CLI nije instaliran. Pokrenite: npm install -g @quasar/cli
) else (
    echo [OK] Quasar CLI instaliran.
)

echo [INFO] Instaliram frontend pakete...
call npm install
if %errorlevel% neq 0 (
    echo [GRESKA] Frontend npm install nije uspio!
    pause
    exit /b 1
)
echo [OK] Frontend paketi instalirani.

echo [INFO] Gradim frontend za produkciju...
call npx quasar build
if %errorlevel% neq 0 (
    echo [UPOZORENJE] Build nije uspio. Koristite: quasar dev
) else (
    echo [OK] Frontend build uspjesan.
)
echo.

:: 5.2.6. SSL CERTIFIKAT
echo [6/6] Postavljanje SSL certifikata...
echo.

set OPENSSL=
openssl version >nul 2>&1
if %errorlevel% equ 0 (
    set OPENSSL=openssl
) else if exist "C:\Program Files\Git\usr\bin\openssl.exe" (
    set OPENSSL=C:\Program Files\Git\usr\bin\openssl.exe
) else if exist "C:\Program Files\OpenSSL-Win64\bin\openssl.exe" (
    set OPENSSL=C:\Program Files\OpenSSL-Win64\bin\openssl.exe
)

if "%OPENSSL%"=="" (
    echo [UPOZORENJE] OpenSSL nije pronadjen - preskacemo SSL.
    echo [INFO] Za SSL: https://slproweb.com/products/Win32OpenSSL.html
    goto :ssl_skip
)

echo [OK] OpenSSL pronadjen.
if not exist "backend\ssl" mkdir backend\ssl

"%OPENSSL%" req -x509 -newkey rsa:4096 -keyout backend\ssl\key.pem -out backend\ssl\cert.pem -days 365 -nodes -subj "/C=HR/ST=PGZ/L=Rijeka/O=VelePark/CN=localhost" >nul 2>&1
if %errorlevel% neq 0 (
    echo [UPOZORENJE] Generiranje certifikata nije uspjelo.
) else (
    echo [OK] SSL certifikat generiran: backend\ssl\cert.pem
    echo [OK] SSL kljuc generiran: backend\ssl\key.pem
)

:ssl_skip
echo.

:: ZAVRSETAK
echo ================================================
echo   INSTALACIJA ZAVRSENA
echo ================================================
echo.
echo Pokrenite backend:   cd backend ^& node server.js
echo Pokrenite frontend:  quasar dev
echo.
echo Backend:  http://localhost:3000
echo Frontend: http://localhost:9000
echo.
pause