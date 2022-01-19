// import { API_KEY, CLIENT_ID } from './credentials.js';
import { GOOGLE_DISCOVERY_DOCS, GOOGLE_SCOPES } from './config.js';

// adapted from https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow#js-client-library (Google Auth with JS Client Library)

// TODO: have a real Google Helper class to encapsulate GoogleAuth?

class GoogleAuth {
  _authInstance;

  /**
   * Authorize the connection to Google API
   * @param controlSigninStatus function to handle the changes of Google signin status
   *
   */
  init(controlSigninStatus) {
    gapi.client
      .init({
        apiKey: process.env.API_KEY,
        clientId: process.env.CLIENT_ID,
        discoveryDocs: GOOGLE_DISCOVERY_DOCS,
        scope: GOOGLE_SCOPES,
      })
      .then(
        function () {
          this._authInstance = gapi.auth2.getAuthInstance();

          // listen for sign-in state changes
          this._authInstance.isSignedIn.listen(controlSigninStatus);

          // handle the initial sign-in state
          controlSigninStatus(this._authInstance.isSignedIn.get());
        }.bind(this),
        function (error) {
          console.log(JSON.stringify(error, null, 2));
        }
      );
  }

  handleSignInSignOut() {
    if (this._authInstance.isSignedIn.get()) {
      // user is authorized and has clicked "Sign out" button
      console.log('Trying to log out');
      this._authInstance.signOut();
    } else {
      // user not signed in. Start Google auth flow.
      console.log('Trying to log in');
      this._authInstance.signIn();
    }
  }

  revokeAccess() {
    this._authInstance.disconnect();
  }

  getInstance() {
    return this._authInstance;
  }

  isAuthorized() {
    return this._authInstance.currentUser.get().hasGrantedScopes(GOOGLE_SCOPES);
  }
}
export default new GoogleAuth();
