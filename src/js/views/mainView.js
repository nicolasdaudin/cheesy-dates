class MainView {
  _btnSignInSignOut = document.querySelector(
    '.options-sign-in-out-google-calendar'
  );
  _btnRevokeAccess = document.querySelector(
    '.options-revoke-access-google-calendar'
  );
  _containerStatusMessage = document.querySelector('.status-message');

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
