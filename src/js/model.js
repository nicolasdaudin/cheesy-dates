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
  locale: 'es-ES', // de-DE
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
