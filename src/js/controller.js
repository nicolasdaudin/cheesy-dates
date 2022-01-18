'use strict';

import * as model from './model.js';
import addEventView from './views/addEventView.js';
import eventsView from './views/eventsView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { UPLOAD_WINDOW_HEADINGS, GOOGLE_SCOPES } from './config.js';

import eventsView from './views/eventsView.js';
import mainView from './views/mainView.js';

import {
  GoogleAuth,
  initGoogle,
  handleSignInSignOutGoogle,
  revokeAccessGoogle,
} from './googleHelper.js';

if (module.hot) {
  module.hot.accept();
}

const controlCreateEvent = async function (data) {
  console.log('controlCreateEvent');

  try {
    mainView.renderMessage('⏳ Create the event in Cheesy Dates app ....');

    const event = model.createEvent(data);
    eventsView.render(model.state.events);

    addEventView.toggleWindow();
    addEventView.clearForm();

    mainView.renderMessage('⏳ Finding the right Google Calendar ...');

    // TODO: add a spinner in addEventView.js until we close the window ...
    // or do the calendar operations after closing the window, and show a spinner in the main view?

    // if app not connected to any calendar, we first try to find the corresponding calendar in Google
    if (!model.state.calendarId) await model.findCalendar();

    // if app not connected and we can't find any calendar, we create a new calendar in Google
    if (!model.state.calendarId) await model.createCalendar();

    mainView.renderMessage(`⏳ Creating the events in Google Calendar !!!`);
    console.log(`⏳ Creating the events in Google Calendar !!!`);
    // now create in Google
    await model.createEventInGoogle(event);
    mainView.renderMessage(`📅 Events created in Google Calendar !!! `);
    console.log(`📅 Events created in Google Calendar !!! `);

    setTimeout(function () {
      mainView.toggleMessage();
    }, 2500);
  } catch (err) {
    console.error(err);
    if (err.status === 401) {
      mainView.renderError(
        'You must signin to Google Calendar if you also want to create the events in Google'
      );
    } else {
      mainView.renderError(
        'Problem while creating events on Google Calendar. See logs.'
      );
    }
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

const controlUpdateSigninStatus = function () {
  const user = GoogleAuth.currentUser.get();
  const isAuthorized = user.hasGrantedScopes(GOOGLE_SCOPES);

  if (isAuthorized) {
    mainView.showGoogleAuthorizedButtons();
    mainView.renderMessage(
      'You are currently signed in and have granted access to this app'
    );
  } else {
    mainView.showGoogleNotAuthorizedButtons();
    mainView.renderMessage(
      'You are either not authorized to use this app or you are signed out'
    );
  }

  setTimeout(function () {
    mainView.toggleMessage();
  }, 2500);
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
  mainView.addHandlerSignInSignOutGoogle(handleSignInSignOutGoogle);
  mainView.addHandlerRevokeAccessGoogle(revokeAccessGoogle);
  gapi.load('client:auth2', initAuthorizeGoogle);

  // _btnCreateDummyEvent.addEventListener('click', createDummyEvent);
};
init();
