'use strict';

class Notepad {

  constructor(notes = []) {
    this._notes = notes;
  }

  get notes() {
    return this._notes;
  }

  findNoteById(id) {
    return this.notes.find(elem => elem.id === id);
  }

  saveNote(note) {
    this.notes.push(note);
    return note;
  }

  deleteNote(id) {
    let findbById = this.findNoteById(id);
    if (findbById.id === id) {
      let positionNote = this.notes.indexOf(findbById);
      this.notes.splice(positionNote, 1);
    }
  }

  updateNoteContent(id, updatedContent) {
    let findbById = this.findNoteById(id);
    if(findbById) {
      Object.assign(findbById, updatedContent);
    }
  }

  updateNotePriority(id, priority) {
    let findbById = this.findNoteById(id);
    let noteObj;
    if (findbById.id === id) {
      findbById.priority = priority;
    }
    noteObj = findbById;
    return noteObj;
  }

  filterNotesByQuery(query) {
    let word = query.toUpperCase();
    const arr = [];
    for (let note of this.notes) {
      let titleUp = note.title.toUpperCase();
      let bodyUp = note.body.toUpperCase();
      if (titleUp.includes(word) || bodyUp.includes(word)) {
        arr.push(note);
      }
    }
    return arr;
  }

  filterNotesByPriority(priority) {
    const arrPriorityNumbers = [];
    for (let priorityNumber of this.notes) {
      if (priority === priorityNumber.priority) {
        arrPriorityNumbers.push(priorityNumber);
      }
    }
    return arrPriorityNumbers;
  };
}


const PRIORITY_TYPES = {
  LOW: 0,
  NORMAL: 1,
  HIGH: 2,
};

const ICON_TYPES = {
  EDIT: 'edit',
  DELETE: 'delete',
  ARROW_DOWN: 'expand_more',
  ARROW_UP: 'expand_less',
};

const NOTE_ACTIONS = {
  DELETE: 'delete-note',
  EDIT: 'edit-note',
  INCREASE_PRIORITY: 'increase-priority',
  DECREASE_PRIORITY: 'decrease-priority',
};

const initialNotes = [{
    id: 'id-1',
    title: 'JavaScript essentials',
    body: 'Get comfortable with all basic JavaScript concepts: variables, loops, arrays, branching, objects, functions, scopes, prototypes etc',
    priority: PRIORITY_TYPES.HIGH,
  },
  {
    id: 'id-2',
    title: 'Refresh HTML and CSS',
    body: 'Need to refresh HTML and CSS concepts, after learning some JavaScript. Maybe get to know CSS Grid and PostCSS, they seem to be trending.',
    priority: PRIORITY_TYPES.NORMAL,
  },
  {
    id: 'id-3',
    title: 'Get comfy with Frontend frameworks',
    body: 'First should get some general knowledge about frameworks, then maybe try each one for a week or so. Need to choose between React, Vue and Angular, by reading articles and watching videos.',
    priority: PRIORITY_TYPES.NORMAL,
  },
  {
    id: 'id-4',
    title: 'Winter clothes',
    body: "Winter is coming! Need some really warm clothes: shoes, sweater, hat, jacket, scarf etc. Maybe should get a set of sportwear as well so I'll be able to do some excercises in the park.",
    priority: PRIORITY_TYPES.LOW,
  },
];

const notepad = new Notepad(initialNotes);

//функція, яка сама буде створювати теги з класами
const createElement = (tag, className) => {
  const createElement = document.createElement(tag);
  // createElement.classList.add(className);
  className.split(' ').map(e => createElement.classList.add(e));
  return createElement;
};

//список ссилок на елементи
const ref = {
  ul: document.querySelector('.note-list'),
};

//функція createNoteContent
const createNoteContent = note => {

  //note__content
  const noteContent = createElement('div', 'note__content');
  //note__title
  const title = createElement('h2', 'note__title');
  title.textContent = note.title;
  //note__body
  const body = createElement('p', 'note__body');
  body.textContent = note.body;
  //appends
  noteContent.append(title, body);


  return noteContent;
}

//функція createActionButton
const createActionButton = (data, icon) => {
  //action
  const buttonAction = createElement('button', 'action');
  buttonAction.dataset.action = data;

  //icon
  const materialIcon = createElement('i', 'material-icons');
  materialIcon.classList.add('action__icon');
  materialIcon.textContent = icon;

  //appends
  buttonAction.append(materialIcon);

  return buttonAction;

}

//функція createNoteFooter
const createNoteFooter = (priority) => {

  //note__footer
  const noteFooter = createElement('footer', 'note__footer');

  //note__section
  const noteSectionOne = createElement('section', 'note__section');
  const noteSectionTwo = createElement('section', 'note__section');


  //note__priority
  const notePriority = createElement('span', 'note__priority');
  notePriority.textContent = priority;

  //appends
  noteSectionOne.append(createActionButton(NOTE_ACTIONS.DECREASE_PRIORITY, ICON_TYPES.ARROW_DOWN), createActionButton(NOTE_ACTIONS.INCREASE_PRIORITY, ICON_TYPES.ARROW_UP));
  noteSectionOne.append(notePriority);
  noteSectionTwo.append(createActionButton(NOTE_ACTIONS.EDIT, ICON_TYPES.EDIT), createActionButton(NOTE_ACTIONS.DELETE, ICON_TYPES.DELETE));
  
  noteFooter.append(noteSectionOne, noteSectionTwo);

  return noteFooter;
}

//фукнція createListItem
const createListItem = note => {

  //note
  const noteDiv = createElement('div', 'note');
  //note-list__item
  const listItem = createElement('li', 'note-list__item');

  //appends
  noteDiv.append(createNoteContent(note));
  noteDiv.append(createNoteFooter(note.priority));

  listItem.append(noteDiv);

  return listItem;

};

//функція, яка приймає ссилку на елемент ul.note-list і масив обєктів заміток
//і викликає createListItem(note) стільки разів, скільки обєктів в масиві
//після чого додає всі карточки в список
const renderNoteList = (listRef, notes) => {
  //перебираємо масив заміток, викликаємо функція для створення і передаємо їй замітку (n-кількість)
  const renderList = notes.map(elem => createListItem(elem));
  //додаємо замітки в список (розпилюємо li в ul)
  listRef.append(...renderList);
};

//передаємо ссилку на елемент і масив заміток
renderNoteList(ref.ul, notepad.notes);
