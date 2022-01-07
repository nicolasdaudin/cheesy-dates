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

const init = function () {
  const containerApp = document.querySelector('.app');
  containerApp.style.opacity = 100;

  // Update UI
  eventsView.render(model.state.events);

  addEventView.addHandlerShowWindow(controlPrepareAddEventView);
  addEventView.addHandlerUpload(controlCreateEvent);

  eventsView.addHandlerClearEvents(controlClearEvents);
};
init();
