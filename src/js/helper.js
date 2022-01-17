// import { API_KEY, CLIENT_ID } from './credentials.js';
import { GOOGLE_DISCOVERY_DOCS, GOOGLE_SCOPES } from './config.js';

/**
 * Authorize the connection to Google API
 * @param controlSigninStatus function to handle the changes of Google signin status
 *
 */
export const initGoogle = function (controlSigninStatus) {
  console.log(process.env.API_KEY, process.env.CLIENT_ID);
  gapi.client
    .init({
      apiKey: process.env.API_KEY,
      clientId: process.env.CLIENT_ID,
      discoveryDocs: GOOGLE_DISCOVERY_DOCS,
      scope: GOOGLE_SCOPES,
    })
    .then(
      function () {
        // listen for sign-in state changes
        gapi.auth2.getAuthInstance().isSignedIn.listen(controlSigninStatus);

        // handle the initial sign-in state
        controlSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      },
      function (error) {
        console.log(JSON.stringify(error, null, 2));
      }
    );
};

export const authorizeGoogle = function () {
  gapi.auth2.getAuthInstance().signIn();
};

export const signoutGoogle = function () {
  gapi.auth2.getAuthInstance().signOut();
};
