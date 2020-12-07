import axios from 'axios';
import { showAlert } from '../utils/alert';
import * as windowView from '../views/windowView';

export default class Card {
  constructor() {}

  async getCards(token) {
    try {
      const res = await axios.get(
        'https://polar-savannah-53668.herokuapp.com/api/v0/users/my-cards',
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return res.data.data.card;
    } catch (err) {
      const { message } = err.response.data;
      showAlert('error', message);
    }
  }

  async createCard(question, answer, user, token) {
    try {
      const res = await axios.post(
        'https://polar-savannah-53668.herokuapp.com/api/v0/cards',
        {
          question,
          answer,
          user,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.status === 'success') {
        showAlert('success', 'Card was created');
      }
    } catch (err) {
      const { message } = err.response.data;
      showAlert('error', message);
    }
  }

  async updateCard(cardId, question, answer, token) {
    try {
      const res = await axios.patch(
        `https://polar-savannah-53668.herokuapp.com/api/v0/cards/${cardId}`,
        {
          question,
          answer,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.status === 'success') {
        showAlert('success', 'Card was updated');
      }
    } catch (err) {
      const { message } = err.response.data;
      showAlert('error', message);
    }
  }

  async deleteCard(cardId, token) {
    try {
      const res = await axios.delete(
        `https://polar-savannah-53668.herokuapp.com/api/v0/cards/${cardId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 204) {
        windowView.clearWindow();
        showAlert('success', 'Card was deleted');
      }
    } catch (err) {
      console.log(err);
      const { message } = err.response.data;
      showAlert('error', message);
    }
  }
}
