"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale
var DateTime = luxon.DateTime;
var Interval = luxon.Interval;

const account1 = {
  reminders: [
    {
      type: "anniversary",
      description: "Ensemble avec Jime",
      date: "2021-12-14T21:31:17.178Z",
      what: "123 mois",
    },
    {
      type: "achievement",
      description: "Courir 2 fois par semaine",
      date: "2022-01-01T10:17:24.185Z",
      what: "50 jours",
    },
    {
      type: "birthday",
      description: "Anniversaire Amelia",
      date: "2021-10-11T10:51:36.790Z",
      what: "2 ans",
    },
  ],

  locale: "es-ES", // de-DE
};

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector(".welcome");

const containerApp = document.querySelector(".app");
const containerEvents = document.querySelector(".events");

const btnAddEventAnniversary = document.querySelector(
  ".add-event--anniversary"
);
const btnAddEventBirthday = document.querySelector(".add-event--birthday");
const btnAddEventAchievement = document.querySelector(
  ".add-event--achievement"
);
const containerOverLay = document.querySelector(".overlay");
const containerAddEventWindow = document.querySelector(".add-event-window");
const btnCloseAddEventWindow = document.querySelector(".btn--close-modal");

const formAddEvent = document.querySelector(".upload");
/////////////////////////////////////////////////
// Functions

const formatMovementDate = function (date, locale) {
  const newdate = new Date(date);

  const daysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 24 * 60 * 60));
  const fromToday = daysPassed(newdate, new Date());
  if (fromToday === 0) return "Today";
  if (fromToday === 1) return "Yesterday";
  if (fromToday <= 7) return `${fromToday} days ago`;

  return new Intl.DateTimeFormat(locale).format(newdate);
};

const displayMovements = function (acc, sort = false) {
  containerEvents.innerHTML = "";

  account1.reminders.forEach(function (reminder, i) {
    const displayDate = formatMovementDate(reminder.date, acc.locale);

    const html = `
      <div class="events__row">
        <div class="events__type events__type--${reminder.type}">${reminder.type}</div>
      <div class="events__date">${displayDate}</div>
      <div class="events__description">${reminder.description}</div>
      <div class="events__what">${reminder.what}</div>
      </div>
    `;

    containerEvents.insertAdjacentHTML("afterbegin", html);
  });
};

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);
};

const toggleAddEventWindow = function () {
  containerOverLay.classList.toggle("hidden");
  containerAddEventWindow.classList.toggle("hidden");
};

const createCheesyEvent = function (data) {
  const eventFirstDate = data.date;

  console.log(eventFirstDate);
  const dt = DateTime.fromISO(eventFirstDate);
  console.log(dt.toString());
  console.log(dt.toLocaleString(DateTime.DATE_HUGE));

  const reminders = [];

  // birthdays
  console.log("------BIRTHDAYS");
  let temp = dt.plus({ years: 1 });
  for (let i = 0; temp.year < 2040; i++) {
    const tempDate = temp.toLocaleString(DateTime.DATE_HUGE);
    console.log(`Celebrating ${i + 1} years or ${i + 1} years on ${tempDate}`);
    reminders.push({
      dt: temp,
      formatted: temp.toLocaleString(DateTime.DATE_HUGE),
      type: { years: i + 1 },
    });
    temp = temp.plus({ years: 1 });
  }
  // console.log(reminders);

  // days
  console.log("------SPECIAL DAYS");
  temp = dt.plus({ days: 1000 });
  for (let i = 0; temp.year < 2040; i++) {
    const tempDate = temp.toLocaleString(DateTime.DATE_HUGE);
    console.log(`Celebrating ${1000 * (i + 1)} days on ${tempDate}`);

    reminders.push({
      dt: temp,
      formatted: temp.toLocaleString(DateTime.DATE_HUGE),
      type: { days: 1000 * (i + 1) },
    });
    temp = temp.plus({ days: 1000 });
  }

  reminders.sort((a, b) => (a.dt < b.dt ? -1 : 1));
  console.log(reminders);
};

const init = function () {
  let currentAccount = account1;

  containerApp.style.opacity = 100;

  // Create current date and time
  const now = new Date();
  const options = {
    hour: "numeric",
    minute: "numeric",
    day: "numeric",
    month: "numeric",
    year: "numeric",
    //weekday: 'long',
  };

  // Update UI
  updateUI(currentAccount);

  // Attach buttons handler
  [btnAddEventAnniversary, btnAddEventBirthday, btnAddEventAchievement].forEach(
    (btn) => {
      btn.addEventListener("click", function () {
        toggleAddEventWindow();
      });
    }
  );
  btnCloseAddEventWindow.addEventListener("click", function () {
    toggleAddEventWindow();
  });
  containerOverLay.addEventListener("click", function () {
    toggleAddEventWindow();
  });

  formAddEvent.addEventListener("submit", function (e) {
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
