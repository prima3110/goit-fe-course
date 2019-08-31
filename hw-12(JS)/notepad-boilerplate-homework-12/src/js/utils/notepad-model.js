import shortid from "shortid";
import { PRIORITY_TYPES } from './constants';
import storage from "./storage";
 
 export default class Notepad {

  constructor(notes = []) {
    this._notes = notes;
  }

  get notes() {
    return this._notes;
  }

  checkStorageNotes(){
    const savedNotes = storage.loadNotes('newNotesAdded');
        if(savedNotes) {
          this._notes = savedNotes;
        }

        return this._notes;
  }

  findNoteById(id) {
    return this.checkStorageNotes().find(note => note.id === id);
  }

  deleteNote(id) {
    return new Promise( (resolve, reject) => {
      setTimeout(() => {
        const deletedNote = this.findNoteById(id);

        if(deletedNote){
          storage.saveNotes('newNotesAdded', this.checkStorageNotes().filter(note => note.id !== id));
        }
        resolve(deletedNote);
        reject('Error deleting note');
      }, 500);
    });
  }

  updateNoteContent(id, updatedContent) {
    let findbById = this.findNoteById(id);
    if(findbById) {
      Object.assign(findbById, updatedContent);
    }
  }

  updateNotePriority(id, priority) {
    let findbById = this.findNoteById(id);
    if (findbById.id) {
    findbById.priority = priority;
    }
    return findbById ;
    }

  filterNotesByQuery(query) {
    return new Promise ((resolve, reject) => {
      setTimeout(() => {
        const filteredNotes = this.checkStorageNotes().filter(note => { 
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
          id: shortid.generate(),
          title: inputValue,
          body: inputText,
          priority: PRIORITY_TYPES.LOW,
        };

        this.saveNote(newNote).catch(console.error());
      
        resolve(newNote);
        reject('Error adding note');
      }, 500);
      });
  };

 saveNote(note) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      this.checkStorageNotes().push(note);
        storage.saveNotes('newNotesAdded', this._notes);

        resolve(note);
        reject('Error saving note');
    }, 500);
  });
};
}