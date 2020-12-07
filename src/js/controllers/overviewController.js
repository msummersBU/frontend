import { elements } from '../views/base';
import { cardLoader, cardMakerLoader } from './cardController';
import { loginHandler, signupHandler } from './loginController';
import { saveSettingsHandler, savePasswordHandler } from './settingsController';
import User from '../models/userModel';
import Card from '../models/cardModel';
import Deck from '../models/deckModel';
import Classroom from '../models/classroomModel';
import { deckLoader, deckMakerLoader } from './deckController';
import { classroomLoader, classroomMakerLoader } from './classroomController';

export const state = {};

// Create all instance of the model when the application starts
state.user = new User();
state.card = new Card();
state.deck = new Deck();
state.classroom = new Classroom();

// Overview Handler
elements.overview.addEventListener('click', async (e) => {
  // user clicks login button in login form
  if (e.target.matches('.btn--btn-login')) {
    loginHandler(e);

    // user clicks signup in the signup form
  } else if (e.target.matches('.btn--btn-signup')) {
    signupHandler(e);

    // user clicks the save settings in the 'my settings' form
  } else if (e.target.matches('.btn--btn-save-settings')) {
    saveSettingsHandler(e);

    // user clicks the change my password in 'my settings' form
  } else if (e.target.matches('.btn--btn-save-password')) {
    savePasswordHandler(e);

    // User clicks a card in the card homepage
  } else if (e.target.closest('.card')) {
    cardLoader(e);

    // User click 'make a new card' button in card homepage
  } else if (e.target.closest('.make-card')) {
    cardMakerLoader(e);

    // User clicks a deck in the homepage
  } else if (e.target.closest('.deck')) {
    deckLoader(e);

    // User clicks 'make a deck' in the homepage
  } else if (e.target.closest('.make-deck')) {
    deckMakerLoader(e);

    // User clicks a classroom in the homepage
  } else if (e.target.closest('.classroom')) {
    classroomLoader(e);

    // user clicks 'make a classroom' in the homepage
  } else if (e.target.closest('.make-classroom')) {
    classroomMakerLoader();
  }
});
