import tick from '../../img/SVG/check.svg';
import cross from '../../img/SVG/circle-with-cross.svg';
import edit from '../../img/SVG/edit.svg';
import bin from '../../img/SVG/trash.svg';
import card from '../../img/SVG/documents.svg';

export const renderCardGrid = (parent, cardArray) => {
  let cards = '';
  cardArray.forEach((card) => {
    const cardMarkup = `
    <div class="card card-${card.id}" data-card=${card.id}>
      <div class="card__options">
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

      <div class="card__details">
        <div class="name">${card.question}</div>
      </div>
    </div>
    `;
    cards += cardMarkup;
  });

  let markup = '';
  markup += `
  <div class="make-card">
    <a href="#" class="btn btn--ghost">Make A New Card</a>
  </div>`;

  markup += `<div class="card-grid">
      ${cards}
  </div>`;

  parent.insertAdjacentHTML('afterbegin', markup);
};

export const renderCardNoOptGrid = (parent, cardArray) => {
  let cards = '';
  cardArray.forEach((card) => {
    const cardMarkup = `
    <div class="card card-${card.id}" data-card=${card.id}>
    <div class="card__options card__options--hide">
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

      <div class="card__details">
        <div class="name">${card.question}</div>
      </div>
    </div>
    `;
    cards += cardMarkup;
  });

  let markup = '';
  markup += `<div class="card-grid">
      ${cards}
  </div>`;

  parent.insertAdjacentHTML('afterbegin', markup);
};

export const renderCardAnswer = (HTMLCard, answer) => {
  const markup = `
  <div class="card__options ">
      <a href="#" class="options options--edit">
        <svg class="icon icon--options icon--edit">
          <use class="card--edit" xlink:href="${edit}"></use>
        </svg>
        <span class="show-hide card--edit">Edit</span>
      </a>

      <a href="#" class="options options--delete">
        <svg class="icon icon--options icon--delete">
          <use class="card--delete" xlink:href="${bin}"></use>
        </svg>
        <span class="show-hide card--delete">Delete</span>
      </a>
      </div>

  <div class="card__details">
    <div class="card__name">${answer}</div>
  </div>

  <div class="answer-form">
    <a href="#" class="answer-form__link">
      <svg class="icon icon--card icon--card-right icon--right">
        <use xlink:href="${tick}"></use>
      </svg>
    </a>

    <a href="#" class="answer-form__link">
      <svg class="icon icon--card icon--card-left icon--wrong">
        <use xlink:href="${cross}"></use>
      </svg>
    </a>
    </div>
  `;

  HTMLCard.innerHTML = markup;
};

export const renderCardAnswerMake = (HTMLCard, answer) => {
  const markup = `
  <div class="card__details">
    <div class="card__name">${answer}</div>
  </div>

  <div class="answer-form">
    <a href="#" class="answer-form__link">
      <svg class="icon icon--card icon--card-right icon--right">
        <use xlink:href="${tick}"></use>
      </svg>
    </a>

    <a href="#" class="answer-form__link">
      <svg class="icon icon--card icon--card-left icon--wrong">
        <use xlink:href="${cross}"></use>
      </svg>
    </a>
    </div>
  `;

  HTMLCard.innerHTML = markup;
};

export const renderCardQuestionMake = (HTMLCard, question) => {
  const markup = `
  <div class="card__details">
    <div class="card__name">${question}</div>
  </div>
  `;

  HTMLCard.innerHTML = markup;
};

export const renderCardQuestion = (HTMLCard, question) => {
  const markup = `
  <div class="card__options">
      <a href="#" class="options options--edit">
        <svg class="icon icon--options icon--edit">
          <use xlink:href="${edit}"></use>
        </svg>
        <span class="show-hide card--delete">Edit</span>
      </a>

      <a href="#" class="options options--delete">
        <svg class="icon icon--options icon--delete">
          <use xlink:href="${bin}"></use>
        </svg>
        <span class="show-hide card--delete">Delete</span>
      </a>
      </div>

  <div class="card__details">
    <div class="card__name">${question}</div>
  </div>
  `;

  HTMLCard.innerHTML = markup;
};

export const renderUpdateCardGrid = (parent, question) => {
  const markup = `             
  <div class="make-card-grid">
  <div class="card card--make">
    <div class="card__details">
      <span class="name">${question}</span>
    </div>
  </div>

  <form action="#" class="make-card__form">
      <label for="question" class="make-card__label">Enter Your Question</label>
      <textarea id="question" class="make-card__textarea textarea-q" wrap="on" minlength="5" maxlength="150" placeholder="Enter your question" required="true" spellcheck="true"></textarea>
    
      <label for="answer" class="make-card__label">Enter Your Answer</label>
      <textarea id="answer" class="make-card__textarea textarea-a" wrap="on" minlength="5" maxlength="150" placeholder="Enter your answer" required="true" spellcheck="true"></textarea>
  </form>

  <div class="make-card__group make-card--switch">
    <a href="#" class="make-card__switch btn btn--switch">Turn Over</a>
  </div>

  <div class="make-card__group make-card--right">
    <a href="#" class="make-card__link">
      <svg class="icon icon--make-card icon--make-card-right icon--right">
        <use href="${tick}"></use>
      </svg>
    </a>
    <span class="make-card__span">Update The Card</span>
  </div>

  <div class="make-card__group make-card--wrong">
    <a href="#" class="make-card__link">
      <svg class="icon icon--make-card icon--make-card-left icon-left icon--wrong">
        <use href="${cross}"></use>
      </svg>
    </a>
    <span class="make-card__span">Let's Stop!</span>
  </div>
</div>`;

  parent.insertAdjacentHTML('afterbegin', markup);
};

export const renderMakeCardGrid = (parent) => {
  const markup = `<div class="make-card-grid">
  <div class="card card--make">
    <div class="card__details">
      <span class="name">What is a Question?</span>
    </div>
  </div>

  <form action="#" class="make-card__form">
      <label for="question" class="make-card__label">Enter Your Question</label>
      <textarea id="question" class="make-card__textarea textarea-q" wrap="on" minlength="5" maxlength="150" placeholder="Enter your question" required="true" spellcheck="true"></textarea>
    
      <label for="answer" class="make-card__label">Enter Your Answer</label>
      <textarea id="answer" class="make-card__textarea textarea-a" wrap="on" minlength="5" maxlength="150" placeholder="Enter your answer" required="true" spellcheck="true"></textarea>
  </form>

  <div class="make-card__group make-card--switch">
    <a href="#" class="make-card__switch btn btn--switch">Turn Over</a>
  </div>

  <div class="make-card__group make-card--right">
    <a href="#" class="make-card__link">
      <svg class="icon icon--make-card icon--make-card-right icon--right">
        <use href="${tick}"></use>
      </svg>
    </a>
    <span class="make-card__span">Create The Card</span>
  </div>

  <div class="make-card__group make-card--wrong">
    <a href="#" class="make-card__link">
      <svg class="icon icon--make-card icon--make-card-left icon-left icon--wrong">
        <use href="${cross}"></use>
      </svg>
    </a>
    <span class="make-card__span">Let's Stop!</span>
  </div>
</div>
`;

  parent.insertAdjacentHTML('afterbegin', markup);
};

export const renderEmptyCardGrid = (parent, array) => {
  const markup = `<div class="make-card">
  <a href="#" class="btn btn--ghost">Make A New Card</a>
</div>

<div class="card-grid">
  <div class="no-item">
      <svg class="icon icon--no-item">
        <use href="${card}"></use>
      </svg>
      <span>make some cards to see them here!</span>
  </div>
</div>`;

  parent.insertAdjacentHTML('afterbegin', markup);
};
