import axios from 'axios';
import { showAlert } from '../utils/alert';
import * as windowView from '../views/windowView';

export default class Deck {
  constructor() {}

  async getDeck(deckId, token) {
    try {
      const res = await axios.get(
        `https://polar-savannah-53668.herokuapp.com/api/v0/decks/${deckId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.data.deck;
    } catch (err) {
      const { message } = err.response.data;
      showAlert(
        'error',
        'The deck no longer exists for this class, please add one'
      );
    }
  }

  async getDecks(token) {
    try {
      const res = await axios.get(
        'https://polar-savannah-53668.herokuapp.com/api/v0/users/my-decks',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.data.deck;
    } catch (err) {
      const { message } = err.response.data;
      showAlert('error', message);
    }
  }

  async createDeck(name, user, cards, token) {
    try {
      const res = await axios.post(
        'https://polar-savannah-53668.herokuapp.com/api/v0/decks/',
        {
          name,
          user,
          cards,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.status === 'success') {
        showAlert('success', 'Deck was created');
      }
    } catch (err) {
      const { message } = err.response.data;
      showAlert('error', message);
    }
  }

  async updateDeck(deckId, name, cards, token) {
    try {
      const res = await axios.patch(
        `https://polar-savannah-53668.herokuapp.com/api/v0/decks/${deckId}`,
        {
          name,
          cards,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.status === 'success') {
        showAlert('success', 'Deck was updated');
      }
    } catch (err) {
      const { message } = err.response.data;
      showAlert('error', message);
    }
  }

  async deleteDeck(deckId, token) {
    try {
      const res = await axios.delete(
        `https://polar-savannah-53668.herokuapp.com/api/v0/decks/${deckId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 204) {
        windowView.clearWindow();
        showAlert('success', 'Deck was deleted');
      }
    } catch (err) {
      const { message } = err.response.data;
      showAlert('error', message);
    }
  }
}
