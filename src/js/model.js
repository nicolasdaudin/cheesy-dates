import { DateTime } from 'luxon';

import { YEARS_LIMIT, REMINDER_EVERY } from './config.js';

export const state = {
  events: [],
  eventType: '',
  locale: 'es-ES', // de-DE
};

export const createEvent = function (data) {
  const eventFirstDate = data.date;

  const dt = DateTime.fromISO(eventFirstDate);

  const reminders = [];

  const yearsLimit = DateTime.now().plus({ years: YEARS_LIMIT }).year;

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
};

export const clearData = function () {
  localStorage.removeItem('events');
  state.events = [];
};

export const saveData = function () {
  localStorage.setItem('events', JSON.stringify(state.events));
};

const init = function () {
  const storedEvents = JSON.parse(localStorage.getItem('events'));
  state.events = storedEvents || [];
};
init();
