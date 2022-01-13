'use strict';

import * as model from './model.js';
import addEventView from './views/addEventView.js';
import eventsView from './views/eventsView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

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

const controlCreateEvent = async function (data) {
  console.log('controlCreateEvent');

  try {
    // mainView.renderMessage('⏳ Finding the right Google Calendar');

    // TODO: add a spinner in addEventView.js until we close the window ...
    // or do the calendar operations after closing the window, and show a spinner in the main view?

    // if app not connected to any calendar, we first try to find the corresponding calendar in Google
    if (!model.state.calendarId) await model.findCalendar();

    // if app not connected and we can't find any calendar, we create a new calendar in Google
    if (!model.state.calendarId) await model.createCalendar();

    // mainView.renderMessage(
    //   `📅 Connected to Google Calendar CHEESY DATES with id ${model.state.calendarId}`
    // );

    model.createEvent(data);

    eventsView.render(model.state.events);

    addEventView.toggleWindow();
    addEventView.clearForm();
  } catch (err) {
    console.error(err);
    mainView.renderError(err.message);
  }
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

// const createDummyEvent = async function () {
//   console.log('####### createDummyEvent');

//   // first, find a 'Cheesy-Dates' calendar
//   try {
//     mainView.renderMessage('⏳ Creating Dummy Event 🗓 ...');

//     // mainView.renderMessage('🎉 Dummy event created');
//     await model.createGoogleDummyEvent();

//     mainView.renderMessage('⏳ Creating Dummy RECURRING Event 🤪 ...');

//     await model.createGoogleRecurringDummyEvents();
//   } catch (err) {
//     console.error(err);
//     mainView.renderError(err.message);
//   }
// };

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

  // mainView.renderMessage('⏳ Authorizing access to Google Calendar');
  mainView.addHandlerAuthorizeGoogle(authorizeGoogle);
  mainView.addHandlerSignoutGoogle(signoutGoogle);
  gapi.load('client:auth2', initAuthorizeGoogle);

  // _btnCreateDummyEvent.addEventListener('click', createDummyEvent);
};
init();
