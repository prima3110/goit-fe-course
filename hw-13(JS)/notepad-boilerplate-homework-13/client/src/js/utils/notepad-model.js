import { PRIORITY_TYPES } from './constants';
import * as api from "../services/api";
 
 export default class Notepad {

  constructor(notes = []) {
    this._notes = notes;
  }

  get notes() {
      return this._notes;
  }

  getNotes() {
    return api.getNotes().then(notes => {
      this._notes = notes;
      return this._notes;
    });
  }

  findNoteById(id) {
    return this._notes.find(note => note.id === id);
  }

  deleteNote(id) {
    return api.deleteNotes(id).then(() => {

      const deletedNote = this.findNoteById(id);

        if(deletedNote){
          this._notes = this._notes.filter(note => note.id !== id);
          return deletedNote;
        }
    });
  }

  updateNoteContent(id, updatedContent) {
    return api.updateNotes(id, updatedContent).then(updatedNote => {

      const findbById = this.findNoteById(id);
  
        if (findbById) {
          Object.assign(findbById, updatedNote);
          return updatedNote;
        }
  
    });
  }

  updateNotePriority(id, updatedPriority) {

    return api.updateNotes(id, {priority: updatedPriority}).then(updatedNote => {

      const findbById = this.findNoteById(id);

      if(findbById){
        findbById.priority = updatedPriority;
        return updatedNote;
      };
    })
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

saveNote(note) {
 return api.saveNotes(note).then(savedNote => {
    this._notes.push(savedNote);

    return savedNote;
  })
};


}