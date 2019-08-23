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
    return this.notes.find(elem => elem.id === id);
  }

  saveNote(note) {
    this.notes.push(note);
    return note;
  }

  deleteNote(id) {
    this._notes = this._notes.filter(note => note.id !== id);
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
    return this.notes.filter(note => { 
      let word = query.toUpperCase();
      let titleUp = note.title.toUpperCase();
      let bodyUp = note.body.toUpperCase();
      return titleUp.includes(word) || bodyUp.includes(word);
    })
  }

  filterNotesByPriority(priority) {
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