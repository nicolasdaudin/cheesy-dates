export const YEARS_LIMIT = 5;

export const GOOGLE_CALENDAR_NAME = 'CHEESY DATES';
export const GOOGLE_MAX_CALENDAR_EVENTS = 10;

// Array of API discovery doc URLs for APIs used by the quickstart
export const GOOGLE_DISCOVERY_DOCS = [
  'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
export const GOOGLE_SCOPES = 'https://www.googleapis.com/auth/calendar';

// map of label headings
export const UPLOAD_WINDOW_HEADINGS = new Map();
UPLOAD_WINDOW_HEADINGS.set('anniversary', {
  heading: 'Add an anniversary',
  subheading: `It will be reminded every month, every 500 days...
    <br>Examples: the day you met someone, the day you married, the day you started your first job`,
});
UPLOAD_WINDOW_HEADINGS.set('birthday', {
  heading: 'Add a birthday YEAH',
  subheading: 'It will be reminded every year',
});
UPLOAD_WINDOW_HEADINGS.set('achievement', {
  heading: 'Add an achievement',
  subheading: `It will be reminded every year
    <br>Examples: 
    the day you stopped smoking, the day you started running every morning`,
});

// map of reminders to be calculated according to tupe of events
export const REMINDER_EVERY = new Map();
REMINDER_EVERY.set('anniversary', [{ days: 500 }, { months: 5 }, { years: 1 }]);
REMINDER_EVERY.set('birthday', [{ years: 1 }, { days: 1000 }]);
REMINDER_EVERY.set('achievement', [{ days: 100 }, { years: 1 }, { months: 1 }]);

export const DEFAULT_LOCALE = 'en';
