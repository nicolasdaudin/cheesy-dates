import { DateTime } from 'luxon';

class EventsView {
  _parentElement = document.querySelector('.events');
  _errorMessage = 'No events found. Please create one';

  _data;

  _clear() {
    this._parentElement.innerHTML = '';
  }

  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this._renderError();

    this._data = this._prepareData(data);

    const markup = this._generateMarkup();

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
      <p>⛔️ ${message}</p>
    </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _prepareData(data) {
    const events = [];
    data.forEach((event) => {
      event.reminders.forEach((reminder) => {
        // we display the reminder only if its date is in the future
        if (DateTime.fromISO(reminder.date) > DateTime.now()) {
          events.push({
            eventType: event.type,
            description: event.description,
            date: reminder.date,
            reminderType: reminder.type,
            nb: reminder.nb,
          });
        }
      });
    });
    events.sort((a, b) => (a.date > b.date ? -1 : 1));
    return events;
  }
  _generateMarkup() {
    return this._data.map((event) => this._generateMarkupEvent(event)).join('');
  }

  _generateMarkupEvent(event) {
    return `
        <div class="events__row">
          <div class="events__type events__type--${event.eventType}">${
      event.eventType
    }</div>
        <div class="events__date">${DateTime.fromISO(event.date).toLocaleString(
          DateTime.DATE_HUGE
        )}</div>
        <div class="events__description">${event.description}</div>
        <div class="events__what">${event.nb} ${event.reminderType}</div>
        </div>
      `;
  }
}

export default new EventsView();
