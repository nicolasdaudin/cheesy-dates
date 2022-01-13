'use strict';

import * as model from './model.js';
import addEventView from './views/addEventView.js';
import eventsView from './views/eventsView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { RRule } from 'rrule';
import { DateTime } from 'luxon';

import { UPLOAD_WINDOW_HEADINGS } from './config.js';

import eventsView from './views/eventsView.js';
import mainView from './views/mainView.js';

import { initGoogle, authorizeGoogle, signoutGoogle } from './helper.js';

const _btnCreateDummyEvent = document.querySelector(
  '.options-create-dummy-event'
);
if (module.hot) {
  module.hot.accept();
}

const controlCreateEvent = function (data) {
  console.log('controlCreateEvent');

  model.createEvent(data);

  eventsView.render(model.state.events);

  addEventView.toggleWindow();
  addEventView.clearForm();
};

const controlPrepareAddEventView = function (eventType) {
  addEventView.toggleWindow();
  model.state.eventType = eventType;

  addEventView.render({ ...UPLOAD_WINDOW_HEADINGS.get(eventType), eventType });
};

const controlClearEvents = function () {
  model.clearData();
  eventsView.render(model.state.events);
};

const listUpcomingEvents = function () {
  console.log('listUpcomingEvents');
  gapi.client.calendar.events
    .list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 10,
      orderBy: 'startTime',
    })
    .then(function (response) {
      var events = response.result.items;
      console.log(events);
    });
};

const createDummyEvent = async function () {
  console.log('####### createDummyEvent');

  mainView.renderMessage('⏳ Connecting to CHEESY DATES calendar 📅 ...');

  // first, find a 'Cheesy-Dates' calendar
  try {
    const calendarListData = await gapi.client.calendar.calendarList.list();
    const calendarList = calendarListData.result.items;
    console.log(calendarList);
    let cheesyDatesCalendar = calendarList.find(
      (cal) => cal.summary === 'CHEESY DATES'
    );
    // console.log(cheesyDatesCalendar);
    if (!cheesyDatesCalendar) {
      const newCalendarData = await gapi.client.calendar.calendars.insert({
        summary: 'CHEESY DATES',
      });
      // console.log(newCalendarData);

      const insertedCalendarData =
        await gapi.client.calendar.calendarList.insert({
          id: newCalendarData.result.id,
        });
      cheesyDatesCalendar = insertedCalendarData.result;
    }
    console.log(cheesyDatesCalendar);

    mainView.renderMessage('⏳ Creating Dummy Event 🗓 ...');

    // mainView.renderMessage('🎉 Dummy event created');
    const newDummyEvent = {
      summary: 'dummy event title',
      start: {
        dateTime: '2022-01-11T11:00:00',
        timeZone: 'Europe/Madrid',
      },
      end: {
        dateTime: '2022-01-11T17:00:00',
        timeZone: 'Europe/Madrid',
      },
    };
    const insertedDummyEventData = await gapi.client.calendar.events.insert({
      calendarId: cheesyDatesCalendar.id,
      ...newDummyEvent,
    });
    console.log('Inserted Dummy Event', insertedDummyEventData.result);

    mainView.renderMessage('⏳ Creating Dummy RECURRING Event 🤪 ...');

    const dummyRRule = new RRule({
      freq: RRule.DAILY,
      dtstart: new Date(Date.UTC(2022, 0, 13, 0, 0, 0)),
      count: 10,
      interval: 2,
    });
    console.log(dummyRRule.all());
    dummyRRule.all().forEach((dummyDate, i) => {
      const celebrated = dummyRRule.options.interval * i + ' days';
      const date = DateTime.fromJSDate(dummyDate).toISODate();
      console.log(dummyDate, date, celebrated);
      const newDummyRecurringEvent = {
        summary: `${celebrated} since Jime and Nico are together`,
        description: `%%${dummyRRule.toString()}%%`,
        start: {
          date,
        },
        end: {
          date,
        },
      };

      const insertedDummyRecurringEventData = gapi.client.calendar.events
        .insert({
          calendarId: cheesyDatesCalendar.id,
          ...newDummyRecurringEvent,
        })
        .then(() => {
          console.log(
            'Inserted Dummy Recurring Event',
            insertedDummyRecurringEventData.result
          );
        });
    });
  } catch (err) {
    console.error(err);
    mainView.renderError(err.message);
  }
};

const getCalendarList = function () {
  console.log('getCalendarList');
  gapi.client.calendar.calendarList.list().then(function (response) {
    var calendars = response.result.items;
    console.log(calendars);
  });
};

const controlUpdateSigninStatus = function (isSignedIn) {
  if (isSignedIn) {
    mainView.toggleGoogleButtons();
    console.log('✅ SIGNED IN !!!!!');
    // getCalendarList();
  } else {
    mainView.toggleGoogleButtons();
    console.log('🤨 NOT SIGNED IN ....');
  }
};

const initAuthorizeGoogle = function () {
  initGoogle(controlUpdateSigninStatus);
};

const init = function () {
  const containerApp = document.querySelector('.app');
  containerApp.style.opacity = 100;

  // Update UI
  eventsView.render(model.state.events);

  addEventView.addHandlerShowWindow(controlPrepareAddEventView);
  addEventView.addHandlerUpload(controlCreateEvent);

  eventsView.addHandlerClearEvents(controlClearEvents);

  mainView.addHandlerAuthorizeGoogle(authorizeGoogle);
  mainView.addHandlerSignoutGoogle(signoutGoogle);
  gapi.load('client:auth2', initAuthorizeGoogle);

  _btnCreateDummyEvent.addEventListener('click', createDummyEvent);
};
init();
