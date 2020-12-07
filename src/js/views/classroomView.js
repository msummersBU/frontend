import edit from '../../img/SVG/edit.svg';
import bin from '../../img/SVG/trash.svg';
import minus from '../../img/SVG/minus.svg';
import plus from '../../img/SVG/plus.svg';
import tick from '../../img/SVG/check.svg';
import cross from '../../img/SVG/circle-with-cross.svg';
import next from '../../img/SVG/chevron-thin-right.svg';
import prev from '../../img/SVG/chevron-thin-left.svg';
import graduation from '../../img/SVG/graduation-cap.svg';
import deck from '../../img/SVG/drive.svg';
import user from '../../img/SVG/user.svg';
import user2 from '../../img/SVG/user.svg';
import { limitCharacters } from './base';
import * as storage from '../utils/localStorage';

export const renderClassroomGrid = (parent, classroomArray) => {
  let classrooms = '';
  classroomArray.forEach((classroom) => {
    const classroomMarkup = isStudent(classroom);
    classrooms += classroomMarkup;
  });

  // checks if the user is a teacher and then allows them to create a new classroom if they are.
  let markup = '';
  markup += isTeacher();

  markup += `
    <div class="classroom-grid">
        ${classrooms}
    </div>;`;

  parent.insertAdjacentHTML('afterbegin', markup);
};

export const renderEmptyClassroomGrid = (parent, array) => {
  let markup = isTeacher();
  markup += `<div class="classroom-grid">
  <div class="no-item">
      <svg class="icon icon--no-item">
        <use href="${graduation}"></use>
      </svg>
      <span>There are no classrooms here!</span>
  </div>
  </div>`;

  parent.insertAdjacentHTML('afterbegin', markup);
};

const isTeacher = () => {
  let markup = '';
  if (
    storage.getObj('user').role === 'teacher' ||
    storage.getObj('user').role === 'admin'
  ) {
    markup += `
    <div class="make-classroom">
        <a href="#" class="btn btn--ghost make-classroom">Make A New Classroom</a>
    </div>`;
  } else {
    markup += `<div class="make-classroom">
    &nbsp; 
      </div>`;
  }
  return markup;
};

const isStudent = (classroom) => {
  let markup = '';
  if (storage.getObj('user').role === 'student') {
    markup = `<div class="classroom classroom-${classroom.id}" data-classroom=${classroom.id}>
    

      <div class="classroom__details">
        <div class="name">${classroom.name}</div>
      </div>
    </div> `;
  } else {
    markup = `<div class="classroom classroom-${classroom.id}" data-classroom=${classroom.id}>
    <div class="classroom__options">
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

      <div class="classroom__details">
        <div class="name">${classroom.name}</div>
      </div>
    </div> `;
  }

  return markup;
};

// Renders all the users in the 'All Users' list
export const renderItemResults = (user, iconType, type, flag) => {
  let icon;

  switch (iconType) {
    case 'student':
      icon = user2;
      break;
    case 'plus':
      icon = plus;
      break;
    case 'minus':
      icon = minus;
      break;
    default:
      icon = user;
  }

  const markup = `
  <li class="make-classroom__item" data-item="${user.id}">
    <a href="#" class="make-classroom__link">
        <svg class="icon icon__make-classroom--card">
        <use href="${icon}"></use>
      </svg>
      <div class="make-classroom__card-details">
        
        <span
          class="make-classroom__span make-classroom-span--answer"
          >${limitCharacters(user.name)}</span
        >
      </div>
    </a>
  </li>`;

  const element = getType(`${type}`, flag);

  document.querySelector(element).insertAdjacentHTML('beforeend', markup);
};

export const clearResults = (type, flag) => {
  const elements = getType(type, flag);
  const elementList = elements[0];
  const elementPaginate = elements[1];

  if (elementList) {
    document.querySelector(`${elementList}`).innerHTML = '';
  }

  if (elementPaginate) {
    document.querySelector(`${elementPaginate}`).innerHTML = '';
  }
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

// Pagination for the 'All Users' list
const renderButton = (page, numResults, resPerPage, type, flag) => {
  const element = getType(type, flag)[1];
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
    showPagination(type, flag);
    document.querySelector(element).insertAdjacentHTML('afterbegin', btn);
  } else {
    hidePagination(type, flag);
  }
};

export const hidePagination = (type, flag) => {
  const element = getType(type, flag)[1];

  if (element) {
    document.querySelector(element).style.display = 'none';
  }
};

const showPagination = (type, flag) => {
  const element = getType(type, flag)[1];

  if (element) {
    document.querySelector(element).style.display = 'flex';
  }
};

/**
 *
 * @param {Refers to class for the element} type
 * @param {Either being in the view render portion or the make render portion} flag
 */
export const getType = (type, flag) => {
  let insert = '';
  if (flag === 'make') {
    switch (type) {
      case 'all-students':
        insert +=
          '.make-classroom__list--students .make-classroom__paginate--students';
        break;
      case 'my-decks':
        insert +=
          '.make-classroom__list--decks .make-classroom__paginate--decks';
        break;
      case 'classroom-students':
        insert +=
          '.make-classroom__list--classroom-students .make-classroom__paginate--classroom-students';
        break;
      case 'classroom-deck':
        insert += '.make-classroom__list--classroom-deck';
        break;
      default:
        break;
    }
  } else if (flag === 'view') {
    switch (type) {
      case 'all-students':
        insert =
          '.view-classroom__list--students .view-classroom__paginate--students';
        break;
      case 'my-decks':
        insert =
          '.view-classroom__list--decks .view-classroom__paginate--decks';
        break;
      case 'classroom-students':
        insert =
          '.view-classroom__list--classroom-students  .view-classroom__paginate--classroom-students';
        break;
      case 'classroom-deck':
        insert = '.view-classroom__list--classroom-deck';
        break;
      default:
        break;
    }
  }
  return insert.split(' ');
};

/**
 *
 * @param {Being an array of students, decks or cards} array
 * @param {Identifier to determine what icon it should be} icon
 * @param {Identifier to determine what element it should retrieve} type
 * @param {Being either make or view render} flag
 * @param {The page number to pass for pagination} page
 * @param {The number of results per page} resPerPage
 */
export const renderResults = (
  array,
  icon,
  type,
  flag,
  page = 1,
  resPerPage = 3
) => {
  clearResults(type, flag);

  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;

  array.slice(start, end).forEach((el) => {
    renderItemResults(el, icon, type, flag);
  });

  renderButton(page, array.length, resPerPage, type, flag);
};

export const renderViewClassroom = (parent, teacherName, deckName, deckId) => {
  const markup = `
  <div class="view-classroom-grid make-classroom-grid">
    <div
      class="view-classroom__student-nav view-classroom__student-nav--users-student"
    >
      <span class="view-classroom__name">Classmates</span>
      <ul class="view-classroom__list view-classroom__list--students">
        
      </ul>

      <div class="view-classroom__paginate--students">
        
      </div>
    </div>

    <div
      class="view-classroom__deck-nav view-classroom__deck-nav--deck"
    >
      <span class="view-classroom__name">Deck</span>
      <ul class="view-classroom__list view-classroom__list--decks">
        <li class="view-classroom__item view-classroom__item--deck" data-deck=${deckId}>
          <a href="#" class="view-classroom__link">
            <svg class="icon icon__view-classroom--card">
              <use href="${deck}"></use>
            </svg>
            <div class="view-classroom__card-details">
              <span
                class="view-classroom__span view-classroom-span--question"
                >${deckName}</span
              >
            </div>
          </a>
        </li>
      </ul>
    </div>

    <div
      class="view-classroom__teacher-nav view-classroom__teacher-nav--users-teacher"
    >
      <span class="view-classroom__name">Teacher</span>
      <ul class="view-classroom__list view-classroom__list">
        <li class="view-classroom__item view-classroom__list--teacher">
          <a href="#" class="view-classroom__link">
            <svg class="icon icon__view-classroom--card">
              <use href="${user}"></use>
            </svg>
            <div class="view-classroom__card-details">
              <span
                class="view-classroom__span view-classroom-span--question"
                >Teacher</span
              >
              <span class="make-deck__span make-deck-span--answer"
                >${teacherName}</span
              >
            </div>
          </a>
        </li>
      </ul>
    </div>

  </div>`;

  parent.insertAdjacentHTML('afterbegin', markup);
};

export const renderMakeClassroom = (parent, classroomData) => {
  const markup = `<div class="make-classroom-grid">

  <form action="#" class="make-classroom__form">
      <label for="classroom-name" class="make-classroom__label">Enter Classroom name</label>
      <input class="make-classroom__input" type="text" minlength="5" maxlength="50" id="classroom-name" placeholder="Classroom Name" value="${
        classroomData === undefined ? '' : classroomData.name
      }">
  </form>

  <div class="make-classroom__student-nav make-classroom__student-nav--users-student">

  <span class="make-classroom__name">All Students</span>
  <ul class="make-classroom__list make-classroom__list--students">
    
  </ul>

  <div class="make-classroom__paginate make-classroom__paginate--students">
    
  </div>
</div>

<div class="make-classroom__deck-nav make-classroom__deck-nav--deck">
  <span class="make-classroom__name">My Decks</span>
  <ul class="make-classroom__list make-classroom__list--decks">
   
  </ul>

  <div class="make-classroom__paginate make-classroom__paginate--decks">
    
  </div>
</div>

<div class="make-classroom__deck-nav make-classroom__deck-nav--deck-curr">
  <span class="make-classroom__name">Classroom deck</span>
  <ul class="make-classroom__list make-classroom__list--classroom-deck">
    
  </ul>
</div>

<div class="make-classroom__student-nav make-classroom__student-nav--users-student-curr">

  <span class="make-classroom__name">Classroom Students</span>
  <ul class="make-classroom__list make-classroom__list--classroom-students">
    
  </ul>

  <div class="make-classroom__paginate make-classroom__paginate--classroom-students">
    
  </div>
</div>
  
<div class="make-classroom__create-box">
  <div class="make-classroom__group make-classroom--right">
    <a href="#" class="make-classroom__link">
      <svg class="icon icon--make-classroom icon--make-classroom-right icon--right">
        <use href="${tick}"></use>
      </svg>
    </a>
    <span class="make-classroom__span">Create The Classroom</span>
  </div>

  <div class="make-classroom__group make-classroom--wrong">
    <a href="#" class="make-classroom__link">
      <svg class="icon icon--make-classroom icon--make-classroom-left icon-left icon--wrong">
        <use href="${cross}"></use>
      </svg>
    </a>
    <span class="make-classroom__span">Let's Stop!</span>
  </div>
  </div>

</div>`;

  parent.insertAdjacentHTML('afterbegin', markup);
};
