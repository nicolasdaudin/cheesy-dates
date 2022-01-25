import { DateTime } from 'luxon';
import { RRule } from 'rrule';

import {
  YEARS_LIMIT,
  REMINDER_EVERY,
  GOOGLE_CALENDAR_NAME,
  GOOGLE_MAX_CALENDAR_EVENTS,
} from './config.js';

export const state = {
  events: [],
  eventType: '',
  locale: 'es-ES', // de-DE TODO: not sure locale is used at the moment... but we could use it to mark the user locale for that user? now it's not stored (but is its storage necessary???)
  calendarId: undefined,
};

export const clearData = function () {
  localStorage.removeItem('events');
  state.events = [];
};

export const saveData = function () {
  localStorage.setItem('events', JSON.stringify(state.events));
};

export const findCalendar = async function () {
  const calendarListData = await gapi.client.calendar.calendarList.list();
  const calendarList = calendarListData.result.items;
  console.log(calendarList);
  let calendar = calendarList.find(
    (cal) => cal.summary === GOOGLE_CALENDAR_NAME
  );
  state.calendarId = calendar?.id;
};

export const createCalendar = async function () {
  const newCalendarData = await gapi.client.calendar.calendars.insert({
    summary: GOOGLE_CALENDAR_NAME,
  });
  // console.log(newCalendarData);

  const insertedCalendarData = await gapi.client.calendar.calendarList.insert({
    id: newCalendarData.result.id,
  });
  cheesyDatesCalendar = insertedCalendarData.result;
  state.calendarId = cheesyDatesCalendar.id;
};

// export const createGoogleDummyEvent = async function () {
//   const newDummyEvent = {
//     summary: 'dummy event title',
//     start: {
//       dateTime: '2022-01-11T11:00:00',
//       timeZone: 'Europe/Madrid',
//     },
//     end: {
//       dateTime: '2022-01-11T17:00:00',
//       timeZone: 'Europe/Madrid',
//     },
//   };
//   const insertedDummyEventData = await gapi.client.calendar.events.insert({
//     calendarId: state.calendarId,
//     ...newDummyEvent,
//   });
//   console.log('Inserted Dummy Event', insertedDummyEventData.result);
// };

export const createEvent = function (data) {
  const eventFirstDate = data.date;

  const dt = DateTime.fromISO(eventFirstDate);

  const reminders = [];

  const yearsLimit = DateTime.now().plus({ years: YEARS_LIMIT }).year;

  // TODO: use RRule (or later? or schedule?) to generate the recurring rule...

  const whatReminders = REMINDER_EVERY.get(state.eventType);
  console.log(whatReminders);

  whatReminders.forEach(function (reminderType) {
    let temp = dt.plus(reminderType);
    const [[type, nb]] = Object.entries(reminderType);
    for (let i = 0; temp.year <= yearsLimit; i++) {
      // we only add the reminder if its date is after the current date
      if (temp > DateTime.now()) {
        reminders.push({
          date: temp.toISO(),
          type,
          nb: nb * (i + 1),
        });
      }
      temp = temp.plus(reminderType);
    }
  });
  console.log(reminders);

  reminders.sort((a, b) => (a.dt < b.dt ? -1 : 1));

  const event = {
    type: state.eventType,
    description: data.description,
    reminders,
  };

  state.events.push(event);
  saveData();

  return event;
};

/**
 * Creates the corresponding event in Google
 * Only creates the first GOOGLE_MAX_CALENDAR_EVENTS events (default 10)
 * @param {*} event
 */
export const createEventInGoogle = async function (event) {
  const reminders = event.reminders.slice(0, GOOGLE_MAX_CALENDAR_EVENTS);

  // TODO: this for (instead of forEach) might be because forEach does not wait on await instructions, so we had to choose for ... of
  for (const reminder of reminders) {
    const googleEvent = {
      summary: `${reminder.nb} ${reminder.type} - ${event.description}`,
      description: `%%%%`, // probably use the RRule again here. to be used to track back from the app the events created
      start: {
        date: DateTime.fromISO(reminder.date).toISODate(),
      },
      end: {
        date: DateTime.fromISO(reminder.date).toISODate(),
      },
    };

    const data = await gapi.client.calendar.events.insert({
      calendarId: state.calendarId,
      ...googleEvent,
    });
    console.log('Event inserted in Google Calendar', data.result);
  }

  // console.log(googleEvent);
};

// TODO: probably can be merged with create Google above or below...
export const computeTempReminders = function (date) {
  // map of reminders to be calculated according to tupe of events

  // I could have used RRule but there's no easy way to output recurring dates only after a certain date
  // the 'dtstart' is only to start the recurring rule so for example 14-january-2011
  // but if we want the results after 20 january 2022 we would need to generate many recurring events first (count: 10000 for example)

  const dt = DateTime.fromISO(date);

  const reminders = [];

  // only compute reminder up until YEAR_LIMIT (included)
  const YEAR_LIMIT = DateTime.now().plus({ years: YEARS_LIMIT }).year;
  // only compute this number of reminders for the temp reminders
  const REMINDER_LIMIT = 10;

  // TODO: use RRule (or later? or schedule?) to generate the recurring rule...

  const whatReminders = REMINDER_EVERY.get(state.eventType);
  console.log(whatReminders);

  whatReminders.forEach(function (reminderType) {
    let temp = dt.plus(reminderType);
    // we add reminders until it reaches a certain year limit
    for (let i = 0; temp.year <= YEAR_LIMIT; i++) {
      // we only add the reminder if its date is after the current date
      if (temp > DateTime.now()) {
        reminders.push(temp.toISO());
      }
      temp = temp.plus(reminderType);
    }
  });
  reminders.sort((a, b) => (a < b ? -1 : 1));
  const onlySomeReminders = reminders.slice(0, REMINDER_LIMIT);

  return onlySomeReminders;
};
// export const createGoogleRecurringDummyEvents = async function () {
//   const dummyRRule = new RRule({
//     freq: RRule.DAILY,
//     dtstart: new Date(Date.UTC(2022, 0, 13, 0, 0, 0)),
//     count: 10,
//     interval: 2,
//   });
//   console.log(dummyRRule.all());
//   dummyRRule.all().forEach((dummyDate, i) => {
//     const celebrated = dummyRRule.options.interval * i + ' days';
//     const date = DateTime.fromJSDate(dummyDate).toISODate();
//     console.log(dummyDate, date, celebrated);
//     const newDummyRecurringEvent = {
//       summary: `${celebrated} since Jime and Nico are together`,
//       description: `%%${dummyRRule.toString()}%%`,
//       start: {
//         date,
//       },
//       end: {
//         date,
//       },
//     };

//     const insertedDummyRecurringEventData = gapi.client.calendar.events
//       .insert({
//         calendarId: state.calendarId,
//         ...newDummyRecurringEvent,
//       })
//       .then(() => {
//         console.log(
//           'Inserted Dummy Recurring Event',
//           insertedDummyRecurringEventData.result
//         );
//       });
//   });
// };

const init = function () {
  const storedEvents = JSON.parse(localStorage.getItem('events'));
  state.events = storedEvents || [];
};
init();
