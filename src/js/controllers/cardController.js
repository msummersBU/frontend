import {
  elements,
  clearOverview,
  optionsHandler,
  cancelMaker,
} from '../views/base';
import * as cardView from '../views/cardView';
import * as windowView from '../views/windowView';
import { state } from './overviewController';
import * as storage from '../utils/localStorage';
import { showAlert } from '../utils/alert';

export const cardLoaderAndRender = async () => {
  await getCardsFromAPI();
  cardRender();
};

export const getCardsFromAPI = async () => {
  // 1. Get the TOKEN
  const token = storage.getObj('token') || state.user.token;

  if (!token) {
    return new Error('You are not logged in');
  }

  // 2. Save the user created cards as an array
  state.card.cards = await state.card.getCards(token);
  storage.storeObj('cards', state.card.cards);
};

export const cardRender = () => {
  // 1. Get the cards
  const cards = storage.getObj('cards') || state.card.cards;

  // 2. Check if they are empty, if so render and exit function
  if (cards.length === 0) {
    return cardView.renderEmptyCardGrid(elements.overview);
  }

  // 3. Render the card grid and cards on the grid
  cardView.renderCardGrid(elements.overview, cards);
};

// Load the card if they have click the entire card or the edit/ delete options
export const cardLoader = (e) => {
  // check if the user clicked either edit or delete card
  if (e.target.matches('.options, .options *')) {
    const click = e.target.closest('.options');
    const cardId = e.target.parentNode.parentNode.parentNode.dataset.card;
    optionsHandler(click, cardId, deleteCard, cardUpdaterMaker);

    // check if the user clicked the whole card
  } else if (e.target.matches('.card, .card *')) {
    const click = e.target.closest('.card');
    cardHandler(click);
  }
};

const cardUpdaterMaker = (cardId) => {
  const cardData = getCard(cardId);

  // 1. Clear overview
  clearOverview();

  // 2. Render the update card and handlers
  cardView.renderUpdateCardGrid(elements.overview, cardData.question);
  addQAtoTextBox(cardData.question, cardData.answer);
  QAValueChanger();
  swapCardFacing();

  cancelMaker('card', state.card.cards, cardView.renderCardGrid);

  // 3. Call update Card handler
  updateCard(cardId);
};

export const getCard = (cardId) => {
  //1. Get the cards array
  const cards = storage.getObj('cards') || state.card.cards;

  //2. Find the card in the cards array via id
  return cards.filter((card) => {
    return card.id === cardId;
  })[0];
};

// When the user interacts with cards in the overview
const cardHandler = (click) => {
  try {
    // 1. Get the Card Id
    const cardId = click.dataset.card;

    // 2. Get the card from the cards array
    const cardData = getCard(cardId);

    // 3. check if the card is a question card or an answer card
    // clicked the question facing side, turn it over to the answer facing side
    if (click.children.length === 2) {
      cardView.renderCardAnswer(
        document.querySelector(`.card-${cardId}`),
        cardData.answer
      );
      // clicked the answer facing side, turn it over to the question facing side
    } else if (click.children.length === 3) {
      cardView.renderCardQuestion(
        document.querySelector(`.card-${cardId}`),
        cardData.question
      );
    }
  } catch (err) {}
};

// render text of card data from when they want to edit the card
const addQAtoTextBox = (question, answer) => {
  document.querySelector('.textarea-q').value = question;
  document.querySelector('.textarea-a').value = answer;
};

// render text from input boxes to the card in 'make a card'
const QAValueChanger = () => {
  // 1. question box update the value in real time to the card
  document.querySelector('.textarea-q').addEventListener('input', (e) => {
    cardView.renderCardQuestionMake(
      document.querySelector('.card--make'),
      document.querySelector('.textarea-q').value
    );
  });

  // 2. answer box update the value in real time to the card
  document.querySelector('.textarea-a').addEventListener('input', (e) => {
    cardView.renderCardQuestionMake(
      document.querySelector('.card--make'),
      document.querySelector('.textarea-a').value
    );
  });
};

// Handler when the card is to be swapped to question or answer side
export const swapCardFacing = () => {
  // 1. set the boolean for card facing
  let cardFacing = 'question';

  // 2. swap card facing side
  document.querySelector('.btn--switch').addEventListener('click', (e) => {
    let textareaBox = '.textarea-q';

    // card to be swapped over to answer side
    if (cardFacing === 'question') {
      textareaBox = '.textarea-q';
      cardFacing = 'answer';

      // card to be swapped over to question side
    } else {
      textareaBox = '.textarea-a';
      cardFacing = 'question';
    }

    // Reuse render question as we are just rendering text to the card not the forms attached with answer card
    cardView.renderCardQuestionMake(
      document.querySelector('.card--make'),
      document.querySelector(textareaBox).value
    );
  });
};

const createCard = () => {
  // User clicks to create the card
  document
    .querySelector('.icon--make-card-right')
    .addEventListener('click', async (e) => {
      // 1. Get the question, answer and user
      const question = document.querySelector('.textarea-q').value;
      const answer = document.querySelector('.textarea-a').value;
      const user = storage.getObj('user') || state.user.userData.id;

      // 2. Check if they have written something to the text-boxes
      if (question && answer && user) {
        // 2.1 Call API to to write card to DB
        await state.card.createCard(
          question,
          answer,
          user,
          storage.getObj('token')
        );

        // 2.2 Clear Overview and reset the grid so they can make more cards
        cardMakerLoader();

        // 3 User has not entered all the text-boxes, send an alert to tell them to write fill it in
      } else {
        showAlert('error', 'Please enter a question and an answer');
      }
    });
};

const updateCard = (cardId) => {
  // User clicks to update the card
  document
    .querySelector('.icon--make-card-right')
    .addEventListener('click', async (e) => {
      // 1. Get the question, answer and user
      const question = document.querySelector('.textarea-q').value;
      const answer = document.querySelector('.textarea-a').value;

      // 2. Check if they have written something to the text-boxes
      if (question && answer) {
        // 2.1 Call API to to write card to DB
        await state.card.updateCard(
          cardId,
          question,
          answer,
          storage.getObj('token')
        );

        // 2.2 Render the homepage to show the change
        window.setTimeout(async () => {
          clearOverview();
          await cardLoaderAndRender();
        }, 1500);

        // 3 User has not entered all the text-boxes, send an alert to tell them to write fill it in
      } else {
        showAlert('error', 'Please enter a question and an answer');
      }
    });
};

export const deleteCard = async (e, cardId) => {
  const click = e.target.closest('.window__content');
  try {
    if (click) {
      // 3. Check if they clicked yes or no to delete the card
      // they clicked yes to delete the card
      if (e.target.matches('.window__ok')) {
        // 3.1 get the token
        const token = storage.getObj('token') || state.user.token;

        // 3.2 Check to see if they are logged in
        if (!token) {
          return new Error('You are not logged in!');
        }

        // 3.3 Delete the card by calling the API
        await state.card.deleteCard(cardId, token);

        // Render the homepage to show the change
        window.setTimeout(async () => {
          clearOverview();
          await cardLoaderAndRender();
        }, 1500);

        // they clicked no to delete the card
      } else {
        windowView.clearWindow();
      }
    }
  } catch (err) {
    showAlert('error', err.message);
  }
};

export const cardMakerLoader = () => {
  clearOverview();
  cardView.renderMakeCardGrid(elements.overview);
  QAValueChanger();
  swapCardFacing();
  createCard();

  cancelMaker('card', state.card.cards, cardView.renderCardGrid);
};
