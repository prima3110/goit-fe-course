'use strict';

class Notepad {

   constructor (notes = []) {
    this._notes = notes;
   }

   get notes() {
     return this._notes;
   }

 findNoteById(id) {
    let result;
    for(let note of this.notes){
      if(note.id === id){
        result = note;
      } 
      }
      return result;
  }

  saveNote(note) {
    this.notes.push(note);
   return note;
  }

  deleteNote(id) {
    let findbById = this.findNoteById(id);
      if(findbById.id === id){
     let positionNote = this.notes.indexOf(findbById);
     this.notes.splice(positionNote,1);
      }
    }

  updateNoteContent(id, updatedContent) {
    let newNote;
    let positionNote;
    let findbById = this.findNoteById(id);
      if (findbById.id === id) {
         positionNote = this.notes.indexOf(findbById);
         findbById = {...findbById, ...updatedContent};
          newNote = findbById;
          this.notes[positionNote] = newNote;
      }
    return newNote;   
  }

  updateNotePriority(id, priority) {
    let findbById = this.findNoteById(id);
    let noteObj;
      if (findbById.id === id){
        findbById.priority = priority;
    } 
    noteObj = findbById;
  return noteObj;
  }

  filterNotesByQuery(query) {
    let word = query.toUpperCase();
    const arr = [];
    for (let note of this.notes){
      let titleUp = note.title.toUpperCase();
      let bodyUp = note.body.toUpperCase();
      if (titleUp.includes(word) || bodyUp.includes(word)){
        arr.push(note);
      }
    }
    return arr;
  }

  filterNotesByPriority(priority) {
    const arrPriorityNumbers = [];
    for (let priorityNumber of this.notes){
      if (priority === priorityNumber.priority){
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

const initialNotes = [
  {
    id: 'id-1',
    title: 'JavaScript essentials',
    body:
      'Get comfortable with all basic JavaScript concepts: variables, loops, arrays, branching, objects, functions, scopes, prototypes etc',
    priority: PRIORITY_TYPES.HIGH,
  },
  {
    id: 'id-2',
    title: 'Refresh HTML and CSS',
    body:
      'Need to refresh HTML and CSS concepts, after learning some JavaScript. Maybe get to know CSS Grid and PostCSS, they seem to be trending.',
    priority: PRIORITY_TYPES.NORMAL,
  },
  {
    id: 'id-3',
    title: 'Get comfy with Frontend frameworks',
    body:
      'First should get some general knowledge about frameworks, then maybe try each one for a week or so. Need to choose between React, Vue and Angular, by reading articles and watching videos.',
    priority: PRIORITY_TYPES.NORMAL,
  },
  {
    id: 'id-4',
    title: 'Winter clothes',
    body:
      "Winter is coming! Need some really warm clothes: shoes, sweater, hat, jacket, scarf etc. Maybe should get a set of sportwear as well so I'll be able to do some excercises in the park.",
    priority: PRIORITY_TYPES.LOW,
  },
];

const notepad = new Notepad(initialNotes);


const createNoteContent = (title, body) => {

 const noteContent = document.createElement('div');
 noteContent.classList.add('note__content');

 const noteTitle = document.createElement('h2');
 noteTitle.classList.add('note__title');
 noteTitle.textContent = title;

 const noteBody = document.createElement('p');
 noteBody.classList.add('note__body');
 noteBody.textContent = body;

 noteContent.append(noteTitle, noteBody);

return noteContent;
}

const createActionButton = (data, icon) => {

 const buttonAction = document.createElement('button');
 buttonAction.classList.add('action');
 buttonAction.dataset.action = data;

 const materialIcon = document.createElement('i');
 materialIcon.classList.add('material-icons', 'action__icon');
 materialIcon.textContent = icon;

 buttonAction.appendChild(materialIcon);

 return buttonAction;

}

const createSection = (firstButton, firstIcon, secondButton, secondIcon) => {
 
 const noteSection = document.createElement('section');
 noteSection.classList.add('note__section');
 noteSection.append(createActionButton(firstButton, firstIcon), createActionButton(secondButton, secondIcon));

 return noteSection;
}

const createNoteFooter = (priority) => {

 const noteFooter = document.createElement('footer');
 noteFooter.classList.add('note__footer');

 const notePriority = document.createElement('span');
 notePriority.classList.add('note__priority');
 notePriority.textContent = priority;

 const firstSection = createSection(
   NOTE_ACTIONS.DECREASE_PRIORITY,
   ICON_TYPES.ARROW_DOWN,
   NOTE_ACTIONS.INCREASE_PRIORITY,
   ICON_TYPES.ARROW_UP
   );

   const secondSection = createSection(
    NOTE_ACTIONS.EDIT, 
    ICON_TYPES.EDIT, 
    NOTE_ACTIONS.DELETE, 
    ICON_TYPES.DELETE
    );

   firstSection.appendChild(notePriority);
   
   noteFooter.append(firstSection, secondSection);
   
   return noteFooter;
};

const createListItem = (note) => {
 
 const noteListItem = document.createElement('li');
 noteListItem.classList.add('note-list__item');
 noteListItem.dataset.id = note.id;

 const noteDiv = document.createElement('div');
 noteDiv.classList.add('note');

 noteDiv.append(createNoteContent(note.title, note.body), createNoteFooter(note.priority));

 noteListItem.appendChild(noteDiv);

 return noteListItem;
};

const renderNoteList = (listRef, notes) => {

 const noteList = notes.map((note) => createListItem(note));
 listRef.append(...noteList);
};

const noteListReference = document.querySelector('ul.note-list');

renderNoteList(noteListReference, notepad.notes);