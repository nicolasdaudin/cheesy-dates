'use strict';

import * as model from './model.js';
import addEventView from './views/addEventView.js';
import eventsView from './views/eventsView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { UPLOAD_WINDOW_HEADINGS } from './config.js';
import eventsView from './views/eventsView.js';

if (module.hot) {
  module.hot.accept();
}

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');

const containerApp = document.querySelector('.app');
const containerEvents = document.querySelector('.events');

// const btnAddEventAnniversary = document.querySelector(
//   '.add-event--anniversary'
// );
// const btnAddEventBirthday = document.querySelector('.add-event--birthday');
// const btnAddEventAchievement = document.querySelector(
//   '.add-event--achievement'
// );
// const containerOverLay = document.querySelector('.overlay');
// const containerAddEventWindow = document.querySelector('.add-event-window');
// const btnCloseAddEventWindow = document.querySelector('.btn--close-modal');

// const labelUploadHeading = document.querySelector('.upload-heading');
// const labelUploadSubheading = document.querySelector('.upload-subheading');
// const labelUploadEventType = document.querySelector('.upload-event__type');
const formAddEvent = document.querySelector('.upload');

/////////////////////////////////////////////////
// Functions

const reset = function () {
  localStorage.removeItem('events');
};

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

const init = function () {
  containerApp.style.opacity = 100;

  // loadData();

  // Update UI
  eventsView.render(model.state.events);

  addEventView.addHandlerShowWindow(controlPrepareAddEventView);
  addEventView.addHandlerUpload(controlCreateEvent);
};
init();
