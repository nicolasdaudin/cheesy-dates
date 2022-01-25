import { DEFAULT_LOCALE } from '../config.js';
import { SUPPORTED_LOCALES, translations } from '../translations.js';

/**
 * MainView is in charge of top navigation bar, main buttons and translations
 */
class MainView {
  _btnSignInSignOut = document.querySelector(
    '.options-sign-in-out-google-calendar'
  );
  _btnRevokeAccess = document.querySelector(
    '.options-revoke-access-google-calendar'
  );
  _containerStatusMessage = document.querySelector('.status-message');
  _translatableElements = document.querySelectorAll('[data-i18n-key]');
  _selectLocale = document.querySelector('.locale-switcher');
  _locale;

  showGoogleAuthorizedButtons() {
    this._btnSignInSignOut.textContent = 'Sign Out';
    this._btnRevokeAccess.classList.remove('hidden');
  }
  showGoogleNotAuthorizedButtons() {
    this._btnSignInSignOut.textContent = 'Sign In/Authorize';
    this._btnRevokeAccess.classList.add('hidden');
  }

  addHandlerSignInSignOutGoogle(handler) {
    this._btnSignInSignOut.addEventListener('click', handler);
  }

  addHandlerRevokeAccessGoogle(handler) {
    this._btnRevokeAccess.addEventListener('click', handler);
  }

  addHandlerSelectLocale(handler) {
    this._selectLocale.addEventListener('change', (e) =>
      handler(e.target.value)
    );
  }

  selectInitLocale(locale) {
    this._selectLocale.value = locale;
  }

  translateAll(locale = DEFAULT_LOCALE) {
    this._locale = SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
    this._translatableElements.forEach(this._translateElement.bind(this));
  }

  _translateElement(element) {
    const key = element.getAttribute('data-i18n-key');
    const translation = translations[this._locale][key];
    element.innerText = translation;
  }

  renderMessage(message) {
    this._containerStatusMessage.classList.remove('hidden');
    this._containerStatusMessage.innerHTML = message;
  }

  toggleMessage() {
    this._containerStatusMessage.classList.toggle('hidden');
  }

  renderError(message) {
    this._containerStatusMessage.classList.remove('hidden');
    this._containerStatusMessage.innerHTML = `🛑 ${message}`;
  }
}
export default new MainView();
