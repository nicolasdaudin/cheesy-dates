# Cheesy Dates

![netlify](https://img.shields.io/netlify/e4237664-3320-451b-b05f-ea6b54ab8b5e)

Cheesy Dates is a web-based pet project to allow you to add reminders about important dates of your life. Like your daughter's birthday (that's an obvious one!), your marriage anniversary, the first time you kissed you girlfriend, the day you stopped smoking.

The app allows you to add corresponding events in Google Calendar, like "500 days since you stopped smoking" or "Celebrating 1500 days since your first kiss with Melinda"

## Build

```bash
npm start
```

Gets deployed on http://localhost:1234

## Storage

Events and reminders are currently stored in Local Storage.

## Google Calendar

The app uses Google Calendar API and will try to connect you to Google services using OAuth 2.0.

If you connect to Google Calendar, any time you add an event in Cheesy Dates it will also be added to Google Calendar.

## Environment variables

On your local development machine you will need the following Google OAuth2 env variables.

```bash
API_KEY=<YOUR_API_KEY>
CLIENT_ID=<YOUR_CLIENT_ID>
CLIENT_SECRET=<YOUR_CLIENT_SECRET>
```

Please ask the developer. Or create a local dev account on Google 🤪

## Languages

So far, not so good.
The system is capable of handling different languages but only three keys have been translated to French, Spanish and English.
See translations.js for more info.

## Missing features

- Add translations for all keys
- Add translation for dates
- Add error messages on the Add Event view
- Change the event type on Add Event View
- Make the reminders frequency real
- Add a server-side
  - add a database
  - add a Google login,
  - add email notifications for reminders
- Add ES6 classes
- **Add tests**
- **Clean code, refactor, ....**
