# DT207G - Backend-baserad webbutveckling, Moment 5 Projekt

Detta repository innehåller koden för en webbtjänst byggd med Node.js och Express. Webbtjänsten hanterar meny, bilduppladdning, bokningar, kontaktmeddelanden, recensioner användarregistreringar, och autentisering. Data lagras i MongoDB och säkras med JWT-baserad autentisering för skyddade endpoints.

## Förberedelser
För att köra detta projekt behöver du ha Node.js och npm installerat på din dator. Du behöver också en MongoDB-databas tillgänglig antingen lokalt eller via en molntjänst.

### Kloning av projekt
Klona projektet med följande kommando:

```bash
git clone https://github.com/iswe2301/backend-projekt.git
```

### Projektberoenden
Kör sedan följande kommando för att installera de beroenden som behövs i projeket:

```bash
npm install
```

## Installation & databas-setup

### Miljövariabler
Börja med att skapa en `.env`-fil (lägg i projektets rotmapp) för att ställa in miljövariabler till port, databas och JWT, email, lösenord och id. Exempel på innehåll/struktur för `.env`-filen finns att se i `.env.sample`-filen.

### Starta servern
För att starta servern kan du använda:

```bash
npm run serve
```

## Schemastruktur

Webbtjänsten använder flera Mongoose-scheman för att definiera datastrukturerna för olika modeller som `User`, `Booking`, `Menu`, `Review`, `Image` och `Contact`. Exempel på detta för `Booking` är:

| Fält            | Typ    | Krav          | Beskrivning                                       |
|-----------------|--------|---------------|---------------------------------------------------|
| name            | String | Obligatoriskt | Namn på personen som bokat                        |
| phone           | String | Obligatoriskt | Telefonnummer till personen som bokat             |
| email           | String | Obligatoriskt | E-postadress till personen som bokat              |
| date            | Date   | Obligatoriskt | Datum och tid när bokningen är reserverad         |
| guests          | Number | Obligatoriskt | Antal personer som bokningen avser                |
| specialRequests | String | Frivilligt    | Eventuella övriga önskemål                        |


## Användning
Webbtjänsten tillhandahåller flera API-endpoints för att hantera bokningar, skicka kontaktmeddelanden, och hantera användarregistrering och autentisering. För att använda med webbtjänsten kan du använda följande endpoints:

| Metod | Ändpunkt                   | Autentisering | Beskrivning                                        |
|-------|----------------------------|---------------|----------------------------------------------------|
| POST  | `/api/register`            | Ja            | Registrerar en ny användare (för administratörer). |
| POST  | `/api/login`               | Nej           | Autentiserar en användare och returnerar JWT.      |
| GET   | `/api/bookings`            | Ja            | Hämtar alla bokningar.                             |
| POST  | `/api/bookings`            | Ja            | Skapar en ny bokning.                              |
| GET   | `/api/messages`            | Ja            | Hämtar alla kontaktmeddelanden.                    |
| POST  | `/api/messages`            | Nej           | Skickar ett nytt kontaktmeddelande.                |
| GET   | `/api/image`               | Nej           | Hämtar bakgrundsbild                               |
| PUT   | `/api/image`               | Ja            | Uppdaterar befintlig bakgrundsbild.                |
| GET   | `/api/dishes`              | Nej           | Hämtar alla rätter i menyn.                        |
| POST  | `/api/dishes`              | Ja            | Lägger till en ny rätt i menyn.                    |
| PUT   | `/api/dishes/:id`          | Ja            | Uppdaterar en specifik rätt i menyn.               |
| DELETE| `/api/dishes/:id`          | Ja            | Tar bort en specifik rätt i menyn.                 |
| GET   | `/api/reviews`             | Nej           | Hämtar alla recensioner.                           |
| POST  | `/api/reviews`             | Nej           | Skapar en ny recension.                            |


### Exempel - logga in användare
Följande json-struktur används för att skicka en postförfrågan till `/api/login`:

``` json
{
    "username": "dittanvändarnamn",
    "password": "dittlösenord"
}
```

När du skickar en POST-förfrågan till `/api/login` med rätt användarnamn och lösenord, kommer en JWT att returneras. Denna token används sedan för att autentisera anrop till skyddade endpoints.

### Autentiserade GET-anrop
När du har loggat in och fått en JWT, måste denna token inkluderas i Authorization header i anrop till skyddade endpoints för att du ska få åtkomst till den skyddade datan. Token skickas som en Bearer-token. Här är ett exempel på hur du kan göra ett GET-anrop till `/api/bookings` med `curl`:

```bash
curl -X GET "https://domain.com/api/bookings" -H "Authorization: Bearer dinJWTtoken"
```

Ersätt `domain.com` med din serveradress och `dinJWTtoken` med den JWT du fått vid inloggning.

* **Av:** Isa Westling
* **Kurs:** Backend-baserat webbutveckling (DT207G)
* **Program:** Webbutvecklingsprogrammet
* **År:** 2024
* **Skola:** Mittuniversitetet