// import { API_KEY, CLIENT_ID } from './credentials.js';
import { GOOGLE_DISCOVERY_DOCS, GOOGLE_SCOPES } from './config.js';

// adapted from https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow#js-client-library (Google Auth with JS Client Library)

// TODO: have a real Google Helper class to encapsulate GoogleAuth?
export let GoogleAuth;
/**
 * Authorize the connection to Google API
 * @param controlSigninStatus function to handle the changes of Google signin status
 *
 */
export const initGoogle = function (controlSigninStatus) {
  gapi.client
    .init({
      apiKey: process.env.API_KEY,
      clientId: process.env.CLIENT_ID,
      discoveryDocs: GOOGLE_DISCOVERY_DOCS,
      scope: GOOGLE_SCOPES,
    })
    .then(
      function () {
        GoogleAuth = gapi.auth2.getAuthInstance();
        // listen for sign-in state changes
        GoogleAuth.isSignedIn.listen(controlSigninStatus);

        // handle the initial sign-in state
        controlSigninStatus(GoogleAuth.isSignedIn.get());
      },
      function (error) {
        console.log(JSON.stringify(error, null, 2));
      }
    );
};

export const handleSignInSignOutGoogle = function () {
  if (GoogleAuth.isSignedIn.get()) {
    // user is authorized and has clicked "Sign out" button
    console.log('Trying to log out');
    GoogleAuth.signOut();
  } else {
    // user not signed in. Start Google auth flow.
    console.log('Trying to log in');
    GoogleAuth.signIn();
  }
};

export const revokeAccessGoogle = function () {
  GoogleAuth.disconnect();
};
