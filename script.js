'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale
var DateTime = luxon.DateTime;
var Interval = luxon.Interval;

const account1 = {
  events: [
    {
      type: 'anniversary',
      description: 'Ensemble avec Jime',
      reminders: [
        {
          date: DateTime.fromISO('2021-12-14T21:31:17.178Z'),
          type: 'months',
          nb: 123,
        },
      ],
    },
    {
      type: 'achievement',
      description: 'Courir 2 fois par semaine',
      reminders: [
        {
          date: DateTime.fromISO('2021-12-14T21:31:17.178Z'),
          type: 'days',
          nb: 50,
        },
      ],
    },
    {
      type: 'birthday',
      description: 'Anniversaire Amelia',
      reminders: [
        {
          date: DateTime.fromISO('2021-10-11T10:51:36.790Z'),
          type: 'years',
          nb: 2,
        },
      ],
    },
  ],

  locale: 'es-ES', // de-DE
};

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');

const containerApp = document.querySelector('.app');
const containerEvents = document.querySelector('.events');

const btnAddEventAnniversary = document.querySelector(
  '.add-event--anniversary'
);
const btnAddEventBirthday = document.querySelector('.add-event--birthday');
const btnAddEventAchievement = document.querySelector(
  '.add-event--achievement'
);
const containerOverLay = document.querySelector('.overlay');
const containerAddEventWindow = document.querySelector('.add-event-window');
const btnCloseAddEventWindow = document.querySelector('.btn--close-modal');

const labelUploadHeading = document.querySelector('.upload-heading');
const labelUploadSubheading = document.querySelector('.upload-subheading');
const labelUploadEventType = document.querySelector('.upload-event__type');
const formAddEvent = document.querySelector('.upload');

const YEARS_LIMIT = 5;
let eventType = '';

// map of label headings
const mapUploadHeadings = new Map();
mapUploadHeadings.set('anniversary', {
  heading: 'Add an anniversary',
  subheading: `It will be reminded every month, every 500 days...
    <br>Examples: the day you met someone, the day you married, the day you started your first job`,
});
mapUploadHeadings.set('birthday', {
  heading: 'Add a birthday',
  subheading: 'It will be reminded every year',
});
mapUploadHeadings.set('achievement', {
  heading: 'Add an achievement',
  subheading: `It will be reminded every year
    <br>Examples: 
    the day you stopped smoking, the day you started running every morning`,
});

// map of reminders to be calculated according to tupe of events
const mapWhatReminders = new Map();
mapWhatReminders.set('anniversary', [
  { days: 500 },
  { months: 5 },
  { years: 1 },
]);
mapWhatReminders.set('birthday', [{ years: 1 }, { days: 1000 }]);
mapWhatReminders.set('achievement', [
  { days: 100 },
  { years: 1 },
  { months: 1 },
]);

/////////////////////////////////////////////////
// Functions

const formatMovementDate = function (date, locale) {
  const newdate = new Date(date);

  const daysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 24 * 60 * 60));
  const fromToday = daysPassed(newdate, new Date());
  if (fromToday === 0) return 'Today';
  if (fromToday === 1) return 'Yesterday';
  if (fromToday <= 7) return `${fromToday} days ago`;

  return new Intl.DateTimeFormat(locale).format(newdate);
};

const displayMovements = function (acc, sort = false) {
  containerEvents.innerHTML = '';

  // build objects with everything
  // TODO: refactor both these .forEach to use only array map-reduce-filter
  const displayedEvents = [];
  acc.events.forEach(function (event) {
    event.reminders.forEach(function (reminder) {
      displayedEvents.push({
        eventType: event.type,
        description: event.description,
        date: reminder.date,
        reminderType: reminder.type,
        nb: reminder.nb,
      });
    });
  });
  displayedEvents.sort((a, b) => (a.date < b.date ? -1 : 1));

  console.log(displayedEvents);

  displayedEvents.map((event) => {
    // TODO: store 'months' instead of months: 123, and just calculate an interval of time of months, on the fly!?
    const html = `
      <div class="events__row">
        <div class="events__type events__type--${event.eventType}">${
      event.eventType
    }</div>
      <div class="events__date">${event.date.toLocaleString(
        DateTime.DATE_HUGE
      )}</div>
      <div class="events__description">${event.description}</div>
      <div class="events__what">${event.nb} ${event.reminderType}</div>
      </div>
    `;

    containerEvents.insertAdjacentHTML('afterbegin', html);
  });
};

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);
};

const toggleAddEventWindow = function () {
  containerOverLay.classList.toggle('hidden');
  containerAddEventWindow.classList.toggle('hidden');
};

const createCheesyEvent = function (data) {
  const eventFirstDate = data.date;

  console.log(eventFirstDate);
  const dt = DateTime.fromISO(eventFirstDate);
  console.log(dt.toString());
  console.log(dt.toLocaleString(DateTime.DATE_HUGE));

  const reminders = [];

  const yearsLimit = DateTime.now().plus({ years: YEARS_LIMIT }).year;

  const whatReminders = mapWhatReminders.get(eventType);
  console.log(whatReminders);

  whatReminders.forEach(function (reminderType) {
    let temp = dt.plus(reminderType);
    const [[type, nb]] = Object.entries(reminderType);
    for (let i = 0; temp.year < yearsLimit; i++) {
      reminders.push({
        date: temp,
        type,
        nb: nb * (i + 1),
      });
      temp = temp.plus(reminderType);
    }
  });
  console.log(reminders);

  // // days
  // temp = dt.plus({ days: 1000 });
  // for (let i = 0; temp.year < yearsLimit; i++) {
  //   const tempDate = temp.toLocaleString(DateTime.DATE_HUGE);
  //   console.log(`Celebrating ${1000 * (i + 1)} days on ${tempDate}`);

  //   reminders.push({
  //     date: temp,
  //     type: { days: 1000 * (i + 1) },
  //   });
  //   temp = temp.plus({ days: 1000 });
  // }

  reminders.sort((a, b) => (a.dt < b.dt ? -1 : 1));
  const event = {
    type: eventType,
    description: data.description,
    reminders,
  };

  account1.events.push(event);
  updateUI(account1);
};

const init = function () {
  let currentAccount = account1;

  containerApp.style.opacity = 100;

  // Create current date and time
  const now = new Date();
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    //weekday: 'long',
  };

  // Update UI
  updateUI(currentAccount);

  // Attach buttons handler
  [btnAddEventAnniversary, btnAddEventBirthday, btnAddEventAchievement].forEach(
    (btn) => {
      btn.addEventListener('click', function (e) {
        // when we click on one of the add event buttons
        eventType = e.target.closest('.add-event').dataset.eventType;
        labelUploadHeading.textContent =
          mapUploadHeadings.get(eventType).heading;
        labelUploadSubheading.innerHTML =
          mapUploadHeadings.get(eventType).subheading;

        // clear first, then add the correct ones
        labelUploadEventType.classList.remove(
          'upload-event__type--anniversary',
          'upload-event__type--birthday',
          'upload-event__type--achievement'
        );
        labelUploadEventType.classList.add(`upload-event__type--${eventType}`);
        labelUploadEventType.textContent = eventType;

        toggleAddEventWindow();
      });
    }
  );
  btnCloseAddEventWindow.addEventListener('click', function () {
    toggleAddEventWindow();
  });
  containerOverLay.addEventListener('click', function () {
    toggleAddEventWindow();
  });

  formAddEvent.addEventListener('submit', function (e) {
    e.preventDefault();

    // retrieve form inputs
    const formData = new FormData(this);
    const dataArray = [...formData];
    const data = Object.fromEntries(dataArray);

    // create cheesy event
    createCheesyEvent(data);

    // clear input fields
    formAddEvent.reset();

    // close window
    toggleAddEventWindow();
  });
};
init();
