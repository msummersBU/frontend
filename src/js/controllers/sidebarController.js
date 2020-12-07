import { elements, clearOverview } from '../views/base';
import { cardLoaderAndRender } from './cardController';
import { deckLoaderAndRender } from './deckController';
import { classroomLoaderAndRender } from './classroomController';
import { renderSettingsView } from './settingsController';
import { state } from './overviewController';
import { showAlert } from '../utils/alert';
import * as storage from '../utils/localStorage';

elements.sidebar.addEventListener('click', (e) => {
  const click = e.target.closest('.side-nav__item');
  if (click) renderActiveItem(e.target.closest('.side-nav__item'));
});

export const renderActiveItem = (click) => {
  elements.sidebarItem.forEach((item) => {
    item.classList.remove('side-nav__item--active');
  });

  click.classList.add('side-nav__item--active');
};

// User clicks 'MY CARDS' in the sidebar nav
elements.card.addEventListener('click', async (e) => {
  try {
    // 1. Clear the overview page
    clearOverview();

    // 2. Check if the user is authenticated
    if (storage.getObj('token') || state.user.token) {
      // 3. Get and Load the cards
      await cardLoaderAndRender();

      // 2.1 Tell them to login
    } else {
      throw new Error('You are not logged in');
    }
  } catch (err) {
    showAlert('error', err.message);
  }
});

// User clicks 'MY DECKS' in the sidebar nav
elements.deck.addEventListener('click', async (e) => {
  try {
    // 1. Clear the overview page
    clearOverview();

    // 2. Check if the user is authenticated
    if (storage.getObj('token') || state.user.token) {
      // 3. Get and Load the decks
      await deckLoaderAndRender();

      // 2.1 Tell them to login
    } else {
      throw new Error('You are not logged in');
    }
  } catch (err) {
    showAlert('error', err.message);
  }
});

// User clicks 'MY CLASSROOMS' in the sidebar nav
elements.classroom.addEventListener('click', async (e) => {
  try {
    // 1. Clear the overview page
    clearOverview();

    // 2. Check if the user is authenticated
    if (storage.getObj('token') || state.user.token) {
      // 3. Get and Load the type
      await classroomLoaderAndRender();

      // 2.1 Tell them to login
    } else {
      throw new Error('You are not logged in');
    }
  } catch (err) {
    showAlert('error', err.message);
  }
});

elements.settings.addEventListener('click', (e) => {
  if (storage.getObj('token') || state.user.token) {
    clearOverview();
    renderSettingsView(e);
  }
});
