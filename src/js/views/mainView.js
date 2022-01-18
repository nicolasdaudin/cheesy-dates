class MainView {
  _btnAuthorizeGoogle = document.querySelector('.options-auth-google-calendar');
  _btnSignoutGoogle = document.querySelector(
    '.options-signout-google-calendar'
  );
  _containerStatusMessage = document.querySelector('.status-message');

  showAuthorizeGoogleButton() {
    this._btnAuthorizeGoogle.classList.remove('hidden');
    this._btnSignoutGoogle.classList.add('hidden');
  }
  showSignoutGoogleButton() {
    this._btnAuthorizeGoogle.classList.add('hidden');
    this._btnSignoutGoogle.classList.remove('hidden');
  }

  addHandlerAuthorizeGoogle(handler) {
    this._btnAuthorizeGoogle.addEventListener('click', handler);
  }

  addHandlerSignoutGoogle(handler) {
    this._btnSignoutGoogle.addEventListener('click', handler);
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
