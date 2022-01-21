import { DateTime } from 'luxon';

class AddEventView {
  _parentElement = document.querySelector('.upload'); // formAddEvent
  _window = document.querySelector('.add-event-window');
  _overlay = document.querySelector('.overlay');
  _btnClose = document.querySelector('.btn--close-modal');

  _btnAddAnniversary = document.querySelector('.add-event--anniversary');
  _btnAddBirthday = document.querySelector('.add-event--birthday');
  _btnAddAchievement = document.querySelector('.add-event--achievement');

  _dateInput = this._parentElement.querySelector('input[type="date"]');

  _labelHeading = document.querySelector('.upload-heading');
  _labelSubheading = document.querySelector('.upload-subheading');
  _labelEventType = document.querySelector('.upload-event__type');

  _containerNextEvents = document.querySelector('.add-event-next-events');

  constructor() {
    this._addHandlerHideWindow();
    this._oldDate = this._dateInput.value;
  }

  clearForm() {
    // clearing form inputs
    this._parentElement.reset();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  /**
   * Renders the view to add an event
   *
   * @param {string} data.heading - heading of the add event form (ex 'Add an anniversary')
   * @param {string} data.subheading - subheading of the add event form (ex 'It will be reminded every hear')
   * @param {string} data.eventType - 'birthday', 'anniversary', 'achievement'
   * @param {Object} data - all info to render the add event form
   *
   */
  render({ heading, subheading, eventType }) {
    this._labelHeading.textContent = heading;
    this._labelSubheading.innerHTML = subheading;

    // clear first, then add the correct ones
    this._labelEventType.classList.remove(
      'upload-event__type--anniversary',
      'upload-event__type--birthday',
      'upload-event__type--achievement'
    );
    this._labelEventType.classList.add(`upload-event__type--${eventType}`);
    this._labelEventType.textContent = eventType;
  }

  addHandlerShowWindow(handler) {
    [
      this._btnAddAnniversary,
      this._btnAddBirthday,
      this._btnAddAchievement,
    ].forEach((btn) => {
      btn.addEventListener('click', function (e) {
        const eventType = e.target.closest('.add-event').dataset.eventType;
        console.log('eventType', eventType);
        handler(eventType);
      });
    });
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerDateChange(handler) {
    // 'change' gets fired at every key stroke. with 'blur' this gets fired only when the field is unfocused - so we check if the date hs changed.
    this._dateInput.addEventListener(
      'blur',
      function (e) {
        if (this._oldDate !== this._dateInput.value) {
          // TODO: use formData instead?
          const newDateValue = this._dateInput.value;
          this._oldDate = newDateValue;
          console.log('updating reminders with new date', newDateValue);

          handler(newDateValue);
        }
      }.bind(this)
    );
  }

  renderReminders(reminders) {
    const markup = reminders
      .map((reminder) => {
        return `<p class="next-event-date">${DateTime.fromISO(
          reminder
        ).toLocaleString(DateTime.DATE_HUGE)}</p>`;
      })
      .join('');

    this._containerNextEvents.innerHTML = '';
    this._containerNextEvents.insertAdjacentHTML('afterbegin', markup);
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();

      // retrieve form inputs
      const formData = new FormData(this);
      const dataArray = [...formData];
      const data = Object.fromEntries(dataArray);
      console.log('addHandlerUpload');
      handler(data);
    });
  }
}
export default new AddEventView();
