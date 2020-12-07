import plus from '../../img/SVG/plus.svg';
import minus from '../../img/SVG/minus.svg';
import tick from '../../img/SVG/check.svg';
import cross from '../../img/SVG/circle-with-cross.svg';
import next from '../../img/SVG/chevron-thin-right.svg';
import prev from '../../img/SVG/chevron-thin-left.svg';
import edit from '../../img/SVG/edit.svg';
import bin from '../../img/SVG/trash.svg';
import deck from '../../img/SVG/drive.svg';
import { limitCharacters } from './base';

export const renderDeckGrid = (parent, deckArray) => {
  let decks = '';
  deckArray.forEach((deck) => {
    const deckMarkup = `
        <div class="deck deck-${deck.id}" data-deck=${deck.id}>
          <div class="deck__options">
            <a href="#" class="options options--edit">
              <svg class="icon icon--options icon--edit">
                <use xlink:href="${edit}"></use>
              </svg>
              <span class="show-hide card--edit">Edit</span>
            </a>

            <a href="#" class="options options--delete">
              <svg class="icon icon--options icon--delete">
                <use xlink:href="${bin}"></use>
              </svg>
              <span class="show-hide card--delete">Delete</span>
            </a>
          </div>

            <div class="deck__details">
                <div class="name">${deck.name}</div>
            </div>
        </div> 
        `;
    decks += deckMarkup;
  });

  const markup = `
    <div class="make-deck">
        <a href="#" class="btn btn--ghost">Make A New Deck</a>
    </div>

    <div class="deck-grid">
        ${decks}
    </div>;`;

  parent.insertAdjacentHTML('afterbegin', markup);
};

export const renderUserCards = (card) => {
  const markup = `
    <li class="make-deck__item" data-card="${card.id}">
    <a href="#" class="make-deck__link">
      <svg class="icon icon__make-deck--card">
        <use href="${plus}"></use>
      </svg>
      <div class="make-deck__card-details">
        <span class="make-deck__span make-deck-span--question">${limitCharacters(
          card.question
        )}</span>
      <span class="make-deck__span make-deck-span--answer">${limitCharacters(
        card.answer
      )}</span>
      </div>
    </a>
  </li>`;

  document
    .querySelector('.make-deck__list--user')
    .insertAdjacentHTML('beforeend', markup);
};

export const clearUserCardsResults = () => {
  document.querySelector('.make-deck__list--user').innerHTML = '';
  document.querySelector('.make-deck__paginate--user').innerHTML = '';
};

export const renderDeckCards = (card) => {
  const markup = `
    <li class="make-deck__item" data-card="${card.id}">
    <a href="#" class="make-deck__link">
      <svg class="icon icon__make-deck--card">
        <use href="${minus}"></use>
      </svg>
      <div class="make-deck__card-details">
        <span class="make-deck__span make-deck-span--question">${limitCharacters(
          card.question
        )}</span>
      <span class="make-deck__span make-deck-span--answer">${limitCharacters(
        card.answer
      )}</span>
      </div>
    </a>
  </li>`;

  document
    .querySelector('.make-deck__list--deck')
    .insertAdjacentHTML('beforeend', markup);
};

export const clearDeckCardsResults = () => {
  document.querySelector('.make-deck__list--deck').innerHTML = '';
  document.querySelector('.make-deck__paginate--deck').innerHTML = '';
};

export const deleteCard = (id) => {
  const card = document.querySelector(`[data-card*="${id}"]`);
  if (card) card.remove();
};

const createButton = (page, type) => `
<button class="btn--inline btn__search btn__search--${type}" data-goto=${
  type === 'prev' ? page - 1 : page + 1
}>
<span>Page ${type === 'prev' ? page - 1 : page + 1}</span>  
<svg class="icon icon__search icon__search--${
  type === 'prev' ? 'prev' : 'next'
}">
    <use href="${type === 'prev' ? prev : next}"></use>
  </svg>
</button>`;

const renderButtonsUser = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage);

  let btn;
  if (page === 1 && pages > 1) {
    // Only Button to go to the next page
    btn = createButton(page, 'next');
  } else if (page < pages) {
    // Both Buttons
    btn = `
        ${createButton(page, 'prev')} 
        ${createButton(page, 'next')}
        `;
  } else if (page === pages && pages > 1) {
    // Only Button to go to the prev page
    btn = createButton(page, 'prev');
  }

  if (btn) {
    addPaginationUser();

    document
      .querySelector('.make-deck__paginate--user')
      .insertAdjacentHTML('afterbegin', btn);
  } else {
    removePaginationUser();
  }
};

const addPaginationUser = () => {
  document.querySelector('.make-deck__paginate--user').style.display = 'flex';
};

export const removePaginationUser = () => {
  document.querySelector('.make-deck__paginate--user').style.display = 'none';
};

const renderButtonsDeck = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage);

  let btn;
  if (page === 1 && pages > 1) {
    // Only Button to go to the next page
    btn = createButton(page, 'next');
  } else if (page < pages) {
    // Both Buttons
    btn = `
        ${createButton(page, 'prev')} 
        ${createButton(page, 'next')}
        `;
  } else if (page === pages && pages > 1) {
    // Only Button to go to the prev page
    btn = createButton(page, 'prev');
  }

  if (btn) {
    addPaginationDeck();

    document
      .querySelector('.make-deck__paginate--deck')
      .insertAdjacentHTML('afterbegin', btn);
  } else {
    removePaginationDeck();
  }
};

const addPaginationDeck = () => {
  document.querySelector('.make-deck__paginate--deck').style.display = 'flex';
};

export const removePaginationDeck = () => {
  document.querySelector('.make-deck__paginate--deck').style.display = 'none';
};

export const renderResultsDeck = (array, page = 1, resPerPage = 4) => {
  clearDeckCardsResults();

  // render the results of the current page
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;

  array.slice(start, end).forEach(renderDeckCards);

  // render pagination button
  renderButtonsDeck(page, array.length, resPerPage);
};

export const renderResults = (array, page = 1, resPerPage = 4) => {
  // render the results of the current page
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;

  array.slice(start, end).forEach(renderUserCards);

  // render pagination button
  renderButtonsUser(page, array.length, resPerPage);
};

export const renderMakeCard = (HTMLCard, value) => {
  const markup = `

  

</div>

<div class="card__details">
  <span class="name">${value}</span>
</div>`;

  HTMLCard.innerHTML = markup;
};

export const renderMakeDeckGrid = (parent) => {
  const markup = `<div class="make-deck-grid">
  <form action="#" class="make-deck__form">
      <label for="deck-name" class="make-deck__label">Enter Deck name</label>
      <input class="make-deck__input" type="text" minlength="5" maxlength="50" id="deck-name" placeholder="Deck Name">
  </form>

  <div class="make-deck__card-nav make-deck__card-nav--user-cards">
    <span class="make-deck__name">My Cards</span>
    <ul class="make-deck__list make-deck__list--user">
      
    </ul>

    <div class="make-deck__paginate make-deck__paginate--user">
      
    </div>
  </div>

  <div class="make-deck__card-nav make-deck__card-nav--deck-cards">
    <span class="make-deck__name">Deck Cards</span>
    <ul class="make-deck__list make-deck__list--deck">
      
    </ul>

    <div class="make-deck__paginate make-deck__paginate--deck">
    
    </div>
  </div>

  <div class="make-deck__card-switch">
    <div class="card card--make make-deck__card">
    <div class="card__options">
      <a href="#" class="options options--add">
        <svg class="icon icon--options icon--add">
          <use xlink:href="${plus}"></use>
        </svg>
        <span class="show-hide card--edit">Add card</span>
      </a>

    </div>

    <div class="card__details">
      <span class="name">What is a Question?</span>
    </div>
    </div>

    <div class="make-deck__group make-deck--switch">
      <a href="#" class="make-deck__switch btn btn--switch">Turn Over</a>
    </div>
  </div>
  
  <div class="make-deck__options">
    <div class="make-deck__group make-deck--right">
      <a href="#" class="make-deck__link">
        <svg class="icon icon--make-deck icon--make-deck-right icon--right">
          <use href="${tick}"></use>
        </svg>
      </a>
      <span class="make-deck__span">Create The Deck</span>
    </div>

    <div class="make-deck__group make-deck--wrong">
      <a href="#" class="make-deck__link">
        <svg class="icon icon--make-deck icon--make-deck-left icon-left icon--wrong">
          <use href="${cross}"></use>
        </svg>
      </a>
      <span class="make-deck__span">Let's Stop!</span>
    </div>
  </div>
</div>`;

  parent.insertAdjacentHTML('afterbegin', markup);
};

export const renderUpdateDeckGrid = (parent, deck) => {
  const markup = `<div class="make-deck-grid">
  <form action="#" class="make-deck__form">
      <label for="deck-name" class="make-deck__label">Enter Deck name</label>
      <input class="make-deck__input" type="text" minlength="5" maxlength="50" id="deck-name" placeholder="Deck Name" value="${deck.name}">
  </form>

  <div class="make-deck__card-nav make-deck__card-nav--user-cards">
    <span class="make-deck__name">My Cards</span>
    <ul class="make-deck__list make-deck__list--user">
      
    </ul>

    <div class="make-deck__paginate make-deck__paginate--user">
      
    </div>
  </div>

  <div class="make-deck__card-nav make-deck__card-nav--deck-cards">
    <span class="make-deck__name">Deck Cards</span>
    <ul class="make-deck__list make-deck__list--deck">
      
    </ul>

    <div class="make-deck__paginate make-deck__paginate--deck">

    </div>
  </div>

  <div class="make-deck__card-switch">
    <div class="card card--make make-deck__card">
    <div class="card__options">
      <a href="#" class="options options--add">
        <svg class="icon icon--options icon--add">
          <use xlink:href="${plus}"></use>
        </svg>
        <span class="show-hide card--edit">Add card</span>
      </a>

    </div>

    <div class="card__details">
      <span class="name">What is a Question?</span>
    </div>
    </div>

    <div class="make-deck__group make-deck--switch">
      <a href="#" class="make-deck__switch btn btn--switch">Turn Over</a>
    </div>
  </div>
  
  <div class="make-deck__options">
    <div class="make-deck__group make-deck--right">
      <a href="#" class="make-deck__link">
        <svg class="icon icon--make-deck icon--make-deck-right icon--right">
          <use href="${tick}"></use>
        </svg>
      </a>
      <span class="make-deck__span">Create The Deck</span>
    </div>

    <div class="make-deck__group make-deck--wrong">
      <a href="#" class="make-deck__link">
        <svg class="icon icon--make-deck icon--make-deck-left icon-left icon--wrong">
          <use href="${cross}"></use>
        </svg>
      </a>
      <span class="make-deck__span">Let's Stop!</span>
    </div>
  </div>
</div>`;

  parent.insertAdjacentHTML('afterbegin', markup);
};

export const renderEmptyDeckGrid = (parent, array) => {
  const markup = `<div class="make-deck">
  <a href="#" class="btn btn--ghost">Make A New Deck</a>
</div>

<div class="deck-grid">
  <div class="no-item">
      <svg class="icon icon--no-item">
        <use href="${deck}"></use>
      </svg>
      <span>make some decks to see them here!</span>
  </div>
</div>`;

  parent.insertAdjacentHTML('afterbegin', markup);
};
