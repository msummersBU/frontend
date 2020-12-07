import { elements, clearOverview } from '../views/base';
import { state } from './overviewController';
import * as headerView from '../views/headerView';
import * as loginView from '../views/loginView';
import * as storage from '../utils/localStorage';

// When there is a token render the user information to the Header UI
if (storage.getObj('token')) {
  const user = storage.getObj('user') || state.user.userData;
  headerView.renderHeaderLogin(user);
}

// User clicks logout button in header
elements.header.addEventListener('click', (e) => {
  // User presses logout, render the default login and signup buttons
  if (e.target.matches('.btn--logout')) {
    clearOverview();
    headerView.renderHeaderDefault();
    storage.removeObj('token');

    // User clicks login render the login form in the overview
  } else if (e.target.matches('.btn--login')) {
    clearOverview();
    loginView.renderLoginForm(elements.overview);
  } else if (e.target.matches('.btn--signup')) {
    clearOverview();
    loginView.renderSignupForm(elements.overview);
  }
});
