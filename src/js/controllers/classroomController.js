import {
  elements,
  clearOverview,
  cancelMaker,
  optionsHandler,
} from '../views/base';
import * as classroomView from '../views/classroomView';
import * as windowView from '../views/windowView';
import * as storage from '../utils/localStorage';
import { showAlert } from '../utils/alert';
import { state } from './overviewController';
import { getDeck } from './deckController';
import { renderCardGrid, renderCardNoOptGrid } from '../views/cardView';

export const classroomLoaderAndRender = async () => {
  await getClassroomsFromAPI();
  classroomRender();
};

export const getClassroomsFromAPI = async () => {
  const token = storage.getObj('token') || state.user.token;

  if (!token) {
    return new Error('You are not logged in');
  }

  state.classroom.classrooms = await state.classroom.getClassroom(
    `${storage.getObj('user').role}`,
    token
  );

  storage.storeObj('classrooms', state.classroom.classrooms);
};

export const classroomRender = () => {
  // 1. Get the classrooms
  const classrooms = state.classroom.classrooms || storage.getObj('classrooms');

  // 2. No classrooms, render the empty grid version
  if (classrooms.length === 0) {
    return classroomView.renderEmptyClassroomGrid(elements.overview);
  }

  // 3. Render the classrooms
  classroomView.renderClassroomGrid(elements.overview, classrooms);
};

// Get one classroom from the array in local storage
const getClassroom = (classroomId) => {
  //1. Get the classrooms array
  const classrooms = storage.getObj('classrooms') || state.classroom.classrooms;

  //2. Find the classroom in the classrooms array via id
  return classrooms.filter((classroom) => {
    return classroom.id === classroomId;
  })[0];
};

const getStudent = (studentId) => {
  const students =
    storage.getObj('studentArray') || state.classroom.studentArray;

  return students.filter((student) => {
    return student.id === studentId;
  })[0];
};

export const classroomLoader = (e) => {
  if (e.target.matches('.options, .options *')) {
    const click = e.target.closest('.options');
    const classroomId =
      e.target.parentNode.parentNode.parentNode.dataset.classroom;

    optionsHandler(click, classroomId, deleteClassroom, classroomUpdateMaker);
  } else if (e.target.matches('.classroom, .classroom *')) {
    const click = e.target.closest('.classroom');
    try {
      // 1. Get the Classroom Id
      const classroomId = click.dataset.classroom;

      // 2. Get the classroom
      const classroom = getClassroom(classroomId);

      // 3. Render view classroom
      classroomViewHandler(classroom);
    } catch (err) {}
  }
};

const classroomViewHandler = async (classroom) => {
  try {
    // 1. Get students and teacher from classroom
    const classroomStudents = classroom.students;
    const classroomTeacher = classroom.teacher;

    // 2. Store the students to state
    state.classroom.studentArray = classroomStudents;
    storage.storeObj('studentArray', classroomStudents);

    // 3. Get the deck for that classroom
    const deckId = classroom.deck;
    const token = state.token || storage.getObj('token');
    const classroomDeck = await state.deck.getDeck(deckId, token);

    // 3.1 Check if the deck exists
    if (!classroomDeck) {
      return new Error(
        'The deck no longer exists for this class, please add one'
      );
    }

    // 4. Store the teacher's deck array to state
    state.classroom.deckArray = classroomDeck;
    storage.storeObj('classroom.deck', classroomDeck);

    // 5. Render classroom
    clearOverview();

    classroomView.renderViewClassroom(
      elements.overview,
      classroomTeacher.name,
      classroomDeck.name,
      deckId
    );

    // 5.1 Render students
    if (classroomStudents.length !== 0) {
      classroomView.renderResults(
        classroomStudents,
        'student',
        'all-students',
        'view'
      );
      searchButton('all-students', 'view', 'student', 'studentArray');
    } else {
      classroomView.hidePagination('all-students', 'view');
    }

    // 6. Add event handlers
    viewDeckFromClassroom(classroomDeck);
  } catch (err) {
    showAlert('error', err.message);
    console.log(err.stack);
  }
};

export const classroomMakerLoader = async () => {
  // 1. Get the token
  const token = state.token || storage.getObj('token');

  // 2. Get the students
  const students = await state.classroom.getStudents(token);
  state.classroom.studentArray = students;
  storage.storeObj('studentArray', students);

  // 3. Get the decks
  const decks = await state.deck.getDecks(token);
  state.classroom.deckArray = decks;
  storage.storeObj('classroom.deckArray', decks);

  // 4. Render the classroom maker grid to the homepage
  classroomMaker(students, decks);
};

const classroomMaker = (students, decks) => {
  // 1. Render the make classroom grid
  clearOverview();
  classroomView.renderMakeClassroom(elements.overview);

  // 2. Render students
  if (students.length !== 0) {
    classroomView.renderResults(students, 'plus', 'all-students', 'make');
    searchButton('all-students', 'make', 'plus', 'studentArray');
  } else {
    classroomView.hidePagination('all-students', 'make');
  }

  // 3. Render the decks
  if (decks.length !== 0) {
    classroomView.renderResults(decks, 'plus', 'my-decks', 'make');
    searchButton('my-decks', 'make', 'plus', 'classroom.deckArray');
  } else {
    classroomView.hidePagination('my-decks', 'make');
  }

  // 4. create local arrays for students
  const studentArray = [];

  // 5. Add handlers
  addItemHandler(studentArray, 'make', 'all-students', 'my-decks');
  removeItemHandler(
    studentArray,
    'make',
    'classroom-students',
    'classroom-deck'
  );
  searchButton('classroom-students', 'make', 'minus', 'classroomStudentArray');

  cancelMaker(
    'classroom',
    state.classroom.classrooms,
    classroomView.renderClassroomGrid
  );

  createClassroom();
};

const classroomUpdateMaker = async (classroomId) => {
  const token = state.token || storage.getObj('token');

  // 1. Get the classroomData
  const classroomData = getClassroom(classroomId);
  const students = await state.classroom.getStudents(token);
  const decks = await state.deck.getDecks(token);
  const classroomDeckId = classroomData.deck;
  const classroomStudents = classroomData.students;

  // 1.1 Get the classroom Deck
  const deck = [getDeck(classroomDeckId, decks)];
  let classroomDeck = [];
  if (deck.length !== 0) {
    classroomDeck = deck;
  }

  // 1.3 add the students and decks to the local storage
  state.classroom.studentArray = students;
  storage.storeObj('studentArray', students);

  state.classroom.deckArray = decks;
  storage.storeObj('classroom.deckArray', decks);

  // 2. render the maker grid
  clearOverview();
  classroomView.renderMakeClassroom(elements.overview, classroomData);

  // 3. Render students
  if (students.length !== 0) {
    classroomView.renderResults(students, 'plus', 'all-students', 'make');
    searchButton('all-students', 'make', 'plus', 'studentArray');
  } else {
    classroomView.hidePagination('all-students', 'make');
  }

  // 4. Render the decks
  if (decks.length !== 0) {
    classroomView.renderResults(decks, 'plus', 'my-decks', 'make');
    searchButton('my-decks', 'make', 'plus', 'classroom.deckArray');
  } else {
    classroomView.hidePagination('my-decks', 'make');
  }

  // 5. Render the classroom students
  if (classroomStudents.length !== 0) {
    classroomView.renderResults(
      classroomStudents,
      'minus',
      'classroom-students',
      'make'
    );
    searchButton(
      'classroom-students',
      'make',
      'minus',
      'classroomStudentArray'
    );
  } else {
    classroomView.hidePagination('classroom-students', 'make');
  }

  // 6. Render the classroom students
  if (classroomDeck.length !== 0) {
    classroomView.renderResults(
      classroomDeck,
      'minus',
      'classroom-deck',
      'make'
    );
  }

  // 7. Event handlers for students and decks
  addItemHandler(classroomStudents, 'make', 'all-students', 'my-decks');
  removeItemHandler(
    classroomStudents,
    'make',
    'classroom-students',
    'classroom-deck'
  );

  cancelMaker(
    'classroom',
    state.classroom.classrooms,
    classroomView.renderClassroomGrid
  );

  // 5. Call the update deck handler
  updateClassroom(classroomId);
};

const createClassroom = async () => {
  // User clicks to create the deck
  document
    .querySelector('.icon--make-classroom-right')
    .addEventListener('click', async (e) => {
      // 1. Get all the input from user
      const name = document.querySelector('.make-classroom__input').value;
      const user = storage.getObj('user').id || state.user.userData.id;
      const deckId = storage.getObj('classroomDeck')[0].id;
      const students = storage.getObj('classroomStudentArray');
      const token = storage.getObj('token');

      // 2. Check if they have given a name, students and a deck
      if (name && deckId && students) {
        // 2.1 Create a class of only distinct values
        const distinctStudents = [
          ...new Set(students.map((student) => student.id)),
        ];

        // 2.1 Create the classroom
        await state.classroom.createClassroom(
          name,
          distinctStudents,
          deckId,
          user,
          token
        );
        await classroomMakerLoader();
      } else {
        showAlert('error', 'Please provide a name, students and a deck');
      }
    });
};

const updateClassroom = (classroomId) => {
  // User clicks to update the deck
  document
    .querySelector('.icon--make-classroom-right')
    .addEventListener('click', async (e) => {
      // 1. Get all the input from user
      const name = document.querySelector('.make-classroom__input').value;
      const deck = storage.getObj('classroomDeck');
      const students = storage.getObj('classroomStudentArray');
      const token = storage.getObj('token');

      let deckId;
      if (deck.length !== 0) {
        deckId = deck[0].id;
      }

      try {
        // 2. Check if they have given a name, students and a deck
        if (name && deckId && students) {
          // 2.1 Create a class of only distinct values
          const distinctStudents = [
            ...new Set(students.map((student) => student.id)),
          ];

          // 2.1 Create the classroom
          await state.classroom.updateClassroom(
            classroomId,
            name,
            distinctStudents,
            deckId,
            token
          );
          await classroomMakerLoader();

          window.setTimeout(async () => {
            clearOverview();
            await classroomLoaderAndRender();
          }, 1500);
        } else {
          showAlert('error', 'Please provide a name, students and a deck');
        }
      } catch (err) {
        showAlert('error', err.message);
      }
    });
};

const deleteClassroom = async (e, classroomId) => {
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
        await state.classroom.deleteClassroom(classroomId, token);

        // Render the homepage to show the change
        window.setTimeout(async () => {
          clearOverview();
          await classroomLoaderAndRender();
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

const addItemHandler = (studentArray, flag, ...type) => {
  const studentNav = classroomView.getType(type[0], flag)[0];
  const deckNav = classroomView.getType(type[1], flag)[0];

  document.querySelector(studentNav).addEventListener('click', (e) => {
    // 1. Get the item that was clicked
    const item = e.target.closest('.icon');

    // 2. check if the click was a plus icon
    if (item) {
      // 2.1 Get the student Id and get the student
      const studentId = item.parentNode.parentNode.dataset.item;
      const student = getStudent(studentId);

      console.log(student);

      // 2.2 Append the student to local studentArray
      studentArray.push(student);

      // 2.3 Store the studentArray in local storage
      storage.storeObj('classroomStudentArray', studentArray);

      // 2.4 render the students to the classroom student nav
      classroomView.renderResults(
        studentArray,
        'minus',
        'classroom-students',
        'make'
      );
    }
  });

  document.querySelector(deckNav).addEventListener('click', (e) => {
    // 1. Get the item that was clicked
    const item = e.target.closest('.icon');

    // 2. check if the click was a plus icon
    if (item) {
      // 2.1 Get the deck Id and get the deck
      const deckId = item.parentNode.parentNode.dataset.item;
      const deckArray = [
        getDeck(deckId, storage.getObj('classroom.deckArray')),
      ];

      // 2.3 Store the studentArray in local storage
      storage.storeObj('classroomDeck', deckArray);

      // 2.4 render the students to the classroom student nav
      classroomView.renderResults(deckArray, 'minus', 'classroom-deck', 'make');
    }
  });
};

const removeItemHandler = (studentArray, flag, ...type) => {
  const studentNav = classroomView.getType(type[0], flag)[0];
  const deckNav = classroomView.getType(type[1], flag)[0];

  document.querySelector(studentNav).addEventListener('click', (e) => {
    // 1. Get the item that was clicked
    const item = e.target.closest('.icon');

    // 2. check if the click was a plus icon
    if (item) {
      // 2.1 Get the student Id and get the student
      const studentId = item.parentNode.parentNode.dataset.item;

      // 2.2 Find the index for the student id
      let index;
      studentArray.forEach((student, i) => {
        if (studentId === student.id) {
          index = i;
        }
      });

      studentArray.splice(index, 1);

      // 2.3 Store the studentArray in local storage
      storage.storeObj('classroomStudentArray', studentArray);

      // 2.4 render the students to the classroom student nav
      classroomView.renderResults(
        studentArray,
        'minus',
        'classroom-students',
        'make'
      );
    }
  });

  document.querySelector(deckNav).addEventListener('click', (e) => {
    // 1. Get the item that was clicked
    const item = e.target.closest('.icon');

    // 2. check if the click was a plus icon
    if (item) {
      const deckArray = [];

      // 2.3 Store the studentArray in local storage
      storage.storeObj('classroomDeck', deckArray);

      // 2.4 render the students to the classroom student nav
      classroomView.renderResults(deckArray, 'minus', 'classroom-deck', 'make');
    }
  });
};

const searchButton = (type, flag, icon, arrayType) => {
  const elements = classroomView.getType(type, flag);
  const elementPaginate = elements[1];

  document.querySelector(elementPaginate).addEventListener('click', (e) => {
    // 1. See if the button was clicked
    const btn = e.target.closest('.btn--inline');
    if (btn) {
      // 1.1. get the page number from the dataset
      const goToPage = parseInt(btn.dataset.goto, 10);
      const array = getArrayType(arrayType);

      // 1.2. clear the card results and pagination
      classroomView.clearResults(type, 'make');

      // 1.3. Render the new cards and new buttons
      classroomView.renderResults(array, icon, type, 'make', goToPage);
      window.scroll(0, 0);
    }
  });
};

const getArrayType = (arrayType) => {
  let array = [];
  switch (arrayType) {
    case 'studentArray':
      array = state.classroom.studentArray || storage.getObj('studentArray');
      break;
    case 'classroom.deckArray':
      array =
        state.classroom.deckArray || storage.getObj('classroom.deckArray');
      break;
    case 'classroomStudentArray':
      array = storage.getObj('classroomStudentArray');
      break;

    default:
  }
  return array;
};

const viewDeckFromClassroom = (deck) => {
  document
    .querySelector('.view-classroom__item--deck')
    .addEventListener('click', (e) => {
      clearOverview();

      storage.storeObj('cards', deck.cards);

      if (storage.getObj('user').role === 'teacher') {
        renderCardGrid(elements.overview, deck.cards);
      } else {
        renderCardNoOptGrid(elements.overview, deck.cards);
      }
    });
};
