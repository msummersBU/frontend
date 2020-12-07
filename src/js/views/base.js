import { windowDeletionHandler } from '../controllers/windowController';

export const elements = {
  headerLoginBtn: document.querySelector('.header__login'),
  header: document.querySelector('header'),
  body: document.querySelector('body'),
  sidebar: document.querySelector('.sidebar'),
  sidebarItem: document.querySelectorAll('.side-nav__item'),
  overview: document.querySelector('.overview'),
  card: document.querySelector('.side-nav-card'),
  deck: document.querySelector('.side-nav-deck'),
  classroom: document.querySelector('.side-nav-classroom'),
  settings: document.querySelector('.side-nav-settings'),
};

export const clearOverview = () => {
  const overview = elements.overview;
  if (overview.hasChildNodes) {
    overview.innerHTML = '';
  }
};

export const limitCharacters = (word) => {
  let newWord = word.split(' ');
  if (newWord.length > 3) {
    newWord.splice(0, 3);
    newWord.push('...');
  }
  return newWord.join(' ');
};

export const cancelMaker = (type, typeArray, typeRender) => {
  // User clicks to cancel the type creation
  document
    .querySelector(`.icon--make-${type}-left`)
    .addEventListener('click', (e) => {
      // 1. Clear the Overview
      clearOverview();

      // 2. Bring the user back to the type homepage
      // deckRender(elements.overview, state.deck.decks);
      typeRender(elements.overview, typeArray);
    });
};

// Handler for Edit and Delete an item
export const optionsHandler = (click, itemId, deleteHandler, editHandler) => {
  // user clicked edit card
  if (Array.from(click.classList).includes('options--edit')) {
    editHandler(itemId);

    // user clicked delete card
  } else if (Array.from(click.classList).includes('options--delete')) {
    windowDeletionHandler(itemId, deleteHandler);
  }
};
