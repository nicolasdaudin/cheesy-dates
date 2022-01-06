class AddEventView {
  _parentElement = document.querySelector('.upload'); // formAddEvent
  _window = document.querySelector('.add-event-window');
  _overlay = document.querySelector('.overlay');
  _btnClose = document.querySelector('.btn--close-modal');

  _btnAddAnniversary = document.querySelector('.add-event--anniversary');
  _btnAddBirthday = document.querySelector('.add-event--birthday');
  _btnAddAchievement = document.querySelector('.add-event--achievement');

  _labelHeading = document.querySelector('.upload-heading');
  _labelSubheading = document.querySelector('.upload-subheading');
  _labelEventType = document.querySelector('.upload-event__type');

  constructor() {
    // this._addHandlerShowWindow();
    this._addHandlerHideWindow();
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
