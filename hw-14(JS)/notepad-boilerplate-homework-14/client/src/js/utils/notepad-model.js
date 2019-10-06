import { PRIORITY_TYPES } from './constants';
import * as api from "../services/api";
 
 export default class Notepad {

  constructor(notes = []) {
    this._notes = notes;
    this.id;
  }

  get notes() {
      return this._notes;
  }

  getId(id) {
    this.id = id;
  }

  throwId() {
    return this.id;
  }

  async getNotes() {
    const notes = await api.getNotes();
      this._notes = notes;
      return this._notes;
  }

  findNoteById(id) {
    return this._notes.find(note => note.id === id);
  }

  async deleteNote(id) {
    await api.deleteNotes(id);
    const deletedNote = this.findNoteById(id);
        if(deletedNote){
          this._notes = this._notes.filter(note => note.id !== id);
          return deletedNote;
        }
  }

  async updateNoteContent(id, updatedContent) {
   const updatedNote = await api.updateNotes(id, updatedContent);
    const findbById = this.findNoteById(id);
        if (findbById) {
          Object.assign(findbById, updatedNote);
          return updatedNote;
        }
  }

  async updateNotePriority(id, updatedPriority) {
    const updatedNote = await api.updateNotes(id, {priority: updatedPriority});
      const findbById = this.findNoteById(id);
      if(findbById){
        findbById.priority = updatedPriority;
        return updatedNote;
      };
    }

  filterNotesByQuery(query) {
    return new Promise ((resolve, reject) => {
      setTimeout(() => {
        const filteredNotes = this._notes.filter(note => { 
          let word = query.toUpperCase();
          let titleUp = note.title.toUpperCase();
          let bodyUp = note.body.toUpperCase();
           return titleUp.includes(word) || bodyUp.includes(word);
          });
          resolve(filteredNotes);
          reject('Error filtering notes');
      }, 500);
    });
  }

  filterNotesByPriority(priority) {
    return this.notes.filter(note => priority === note.priority);
  };

  saveInput(inputValue, inputText) {
    return new Promise ((resolve, reject) => {
      setTimeout(() => {
        const newNote = {
          title: inputValue,
          body: inputText,
          priority: PRIORITY_TYPES.LOW,
        };

        resolve(this.saveNote(newNote));
        reject('Error adding note');
      }, 500);
      });
  };

async saveNote(note) {
 const savedNote = await api.saveNotes(note);
    this._notes.push(savedNote);
    return savedNote;
};


}