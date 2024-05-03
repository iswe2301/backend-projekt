# DT207G - Backend-baserad webbutveckling, Moment 4 Autentisering och säkerhet
Detta repository innehåller koden för en webbtjänst byggd med Node.js och Express. Webbtjänsten använder JWT-baserad autentisering och hanterar användardata genom att erbjuda funktionalitet för att registrera nya användare (Create) och logga in (Read). Dessutom tillhandahåller tjänsten en skyddad route som ger autentiserade användare åtkomst till specifik data (Read). All data lagras i en MongoDB-databas, vilket inkluderar både användarinformation och andra data som kräver autentisering för åtkomst.

## Förberedelser
För att köra detta projekt behöver du ha Node.js och npm installerat på din dator. Du behöver också en MongoDB-databas tillgänglig antingen lokalt eller via en molntjänst.

### Kloning av projekt
Klona projektet med följande kommando:

```bash
git clone https://github.com/iswe2301/backend-moment4.1.git
```

### Projektberoenden
Kör sedan följande kommando för att installera de beroenden som behövs i projeket:

```bash
npm install
```

## Installation & databas-setup

### Miljövariabler
Börja med att skapa en `.env`-fil (lägg i projektets rotmapp) för att ställa in miljövariabler till port, databas och JWT. Exempel på innehåll/struktur för `.env`-filen finns att se i `.env.sample`-filen.

### Starta servern
För att starta servern kan du använda:

```bash
npm run serve
```

## Schemastruktur
Webbtjänsten använder ett Mongoose-schema för att definiera strukturen på `User`-modellen i MongoDB. Nedan är en beskrivning av varje fält i schemat:

| Fält     | Typ   | Krav                 | Beskrivning                                                       |
|----------|-------|----------------------|-------------------------------------------------------------------|
| username | String| Obligatoriskt, unikt | Användarnamnet för kontot. Måste vara unikt.                      |
| password | String| Obligatoriskt        | Lösenordet för kontot. Hashas innan det sparas.                   |
| created  | Date  | Automatisk           | Datum och tid när kontot skapades. Skapas automatiskt av MongoDB. |

## Användning
För att använda med webbtjänsten kan du använda följande endpoints:

| Metod   | Ändpunkt                   | Beskrivning                                                  |
|---------|----------------------------|--------------------------------------------------------------|
| POST    | `/api/register`            | Registrerar en ny användare.                                 |
| POST    | `/api/login`               | Loggar in en användare och returnerar en JWT.                |
| GET     | `/api/experiences`         | Hämtar alla jobberfarenheter (kräver autentisering med JWT). |

**OBS!** Vid POST-anrop för att registrera eller logga in en användare måste du skicka med användarnamn och lösenord. Se exempel nedan.

### Registrera / logga in användare
Följande json-struktur används för att skicka en postförfrågan till `/api/register` samt `/api/login`:

``` json
{
    "username": "dittanvändarnamn",
    "password": "dittlösenord"
}
```

När du skickar en POST-förfrågan till `/api/login` med rätt användarnamn och lösenord, kommer en JWT att returneras. Denna token används sedan för att autentisera anrop till skyddade endpoints.

### Autentiserade GET-anrop
När du har loggat in och fått en JWT, måste denna token inkluderas i Authorization header i anrop till skyddade endpoints för att du ska få åtkomst till den skyddade datan. Token skickas som en Bearer-token. Här är ett exempel på hur du kan göra ett GET-anrop till `/api/experiences` med `curl`:

```bash
curl -X GET "https://domain.com/api/experiences" -H "Authorization: Bearer dinJWTtoken"
```

Ersätt `domain.com` med din serveradress och `dinJWTtoken` med den JWT du fått vid inloggning.

* **Av:** Isa Westling
* **Kurs:** Backend-baserat webbutveckling (DT207G)
* **Program:** Webbutvecklingsprogrammet
* **År:** 2024
* **Skola:** Mittuniversitetet