import axios from 'axios';
import * as storage from '../utils/localStorage';
import { showAlert } from '../utils/alert';

export default class User {
  constructor() {}

  async updatePassword(data, token) {
    try {
      const res = await axios.patch(
        'https://polar-savannah-53668.herokuapp.com/api/v0/users/update-password',
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.status === 'success') {
        showAlert('success', 'Password updated successfully!');

        // store the new token
        this.token = await res.data.token;
        storage.storeObj('token', this.token);

        // add user info to the state object
        await this.getMe();
        return true;
      }
      return false;
    } catch (err) {
      const { message } = err.response.data;
      showAlert('error', message);
    }
  }

  async updateMe(data, token) {
    try {
      const res = await axios.patch(
        'https://polar-savannah-53668.herokuapp.com/api/v0/users/update-me',
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.status === 'success') {
        showAlert('success', 'Account updated successfully!');
        // add user info to the state object
        await this.getMe();
        return true;
      }
      return false;
    } catch (err) {
      const { message } = err.response.data;
      showAlert('error', message);
    }
  }

  async signup(name, email, password, passwordConfirm, role) {
    try {
      const res = await axios.post(
        'https://polar-savannah-53668.herokuapp.com/api/v0/users/sign-up',
        {
          name,
          email,
          password,
          passwordConfirm,
          role,
        }
      );

      if (res.data.status === 'success') {
        showAlert('success', 'Signed up successfully!');
        this.token = await res.data.token;
        storage.storeObj('token', this.token);

        // add user info to the state object
        await this.getMe();
        return true;
      }
      return false;
    } catch (err) {
      const { message } = err.response.data;
      showAlert('error', message);
    }
  }

  async login(email, password) {
    try {
      const res = await axios.post(
        'https://polar-savannah-53668.herokuapp.com/api/v0/users/login',
        { email, password }
      );
      if (res.data.status === 'success') {
        showAlert('success', 'Logged in successfully!');
        this.token = await res.data.token;
        storage.storeObj('token', this.token);

        // add user info to the state object
        await this.getMe();
        return true;
      }
      return false;
    } catch (err) {
      const { message } = err.response.data;
      showAlert('error', message);
    }
  }

  async getMe() {
    const token = storage.getObj('token') || this.token;
    if (token) {
      try {
        const res = await axios.get(
          'https://polar-savannah-53668.herokuapp.com/api/v0/users/my-account',
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.status === 'success') {
          this.userData = await res.data.data.user;
          storage.storeObj('user', this.userData);
        }
      } catch (err) {
        const message = err.response.data;
        showAlert('error', message);
      }
    }
  }
}
