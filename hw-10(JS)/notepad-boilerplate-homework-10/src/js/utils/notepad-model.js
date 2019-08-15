import shortid from "shortid";
import { PRIORITY_TYPES } from './constants';
 
 export default class Notepad {

  constructor(notes = []) {
    this._notes = notes;
  }

  get notes() {
    return this._notes;
  }

  findNoteById(id) {
    let result;
    this.notes.find(note => {
      note.id === id;
      result = note;
    })
    return result;
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
    let newNote;
    let positionNote;
    let findbById = this.findNoteById(id);
    if (findbById.id === id) {
      positionNote = this.notes.indexOf(findbById);
      findbById = {
        ...findbById,
        ...updatedContent
      };
      newNote = findbById;
      this.notes[positionNote] = newNote;
    }
    return newNote;
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
    return this.notes.filter(note => { 
      let word = query.toUpperCase();
      let titleUp = note.title.toUpperCase();
      let bodyUp = note.body.toUpperCase();
      return titleUp.includes(word) || bodyUp.includes(word);
    })
  }

  filterNotesByPriority(priority) {
    // const arrPriorityNumbers = [];
    // this.notes.map(note => {
    //     if (priority === note.priority) {
    //       arrPriorityNumbers.push(note);
    //     }
    // })
    // return arrPriorityNumbers;
    return this.notes.filter(note => priority === note.priority);
  };

  addListItem(inputValue, inputText) {
    const newNote = {
      id: shortid.generate(),
      title: inputValue,
      body: inputText,
      priority: PRIORITY_TYPES.LOW,
    };
    this._notes.push(newNote);
    return newNote;
  }
 }