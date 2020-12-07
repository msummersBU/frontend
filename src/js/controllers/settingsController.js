import { elements, clearOverview } from '../views/base';
import * as settingsView from '../views/settingsView';
import * as headerView from '../views/headerView';
import * as storage from '../utils/localStorage';
import { state } from './overviewController';

export const renderSettingsView = (e) => {
  settingsView.renderSettings(elements.overview, storage.getObj('user'));
};

export const saveSettingsHandler = async (e) => {
  e.preventDefault();
  const form = new FormData();

  const name = document.querySelector('#name').value;
  const email = document.querySelector('#email').value;
  const photo = document.querySelector('#photo').files[0];
  const token = state.token || storage.getObj('token');

  form.append('name', name);
  form.append('email', email);
  form.append('photo', photo);

  const updated = await state.user.updateMe(form, token);

  if (updated) {
    const user = storage.getObj('user');
    await headerView.renderHeaderLogin(user);
    clearOverview();
    settingsView.renderSettings(elements.overview, storage.getObj('user'));
  }
};

export const savePasswordHandler = async (e) => {
  e.preventDefault();
  document.querySelector('.btn--btn-save-password').value = 'updating ...';

  const oldPassword = document.querySelector('#oldPassword').value;
  const newPassword = document.querySelector('#newPassword').value;
  const newPasswordConfirm = document.querySelector('#confirmPassword').value;
  const token = state.token || storage.getObj('token');

  const updated = await state.user.updatePassword(
    {
      oldPassword,
      newPassword,
      newPasswordConfirm,
    },
    token
  );

  if (updated) {
    clearOverview();
    settingsView.renderSettings(elements.overview, storage.getObj('user'));
  }
};
