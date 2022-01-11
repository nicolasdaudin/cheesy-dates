import { API_KEY, CLIENT_ID, DISCOVERY_DOCS, SCOPES } from './credentials.js';

/**
 * Authorize the connection to Google API
 * @param controlSigninStatus function to handle the changes of Google signin status
 *
 */
export const initGoogle = function (controlSigninStatus) {
  gapi.client
    .init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES,
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
