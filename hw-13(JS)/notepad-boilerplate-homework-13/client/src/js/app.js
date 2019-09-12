import {Notyf} from 'notyf';
import { NOTE_ACTIONS, NOTIFICATION_MESSAGES } from './utils/constants';
import Notepad from './utils/notepad-model';
import { ref } from './utils/ref';
import { renderNoteList, addNoteList, renderFilteredNotes } from './utils/view';
import MicroModal from 'micromodal';
import 'notyf/notyf.min.css';
import storage from './utils/storage';


const notepad = new Notepad();
const notyf = new Notyf();

notepad.getNotes().then(notes => renderNoteList(ref.ul, notes));

const inputChecking = (event) => {
  const inputedTitle = storage.loadNotes('inputValue');
  const inputedBody = storage.loadNotes('inputText');
  if(inputedTitle || inputedBody){
    ref.form[0].value = inputedTitle;
    ref.form[1].value = inputedBody;
  };
};

const inputSave = (event) => {
  const [input, textarea] = event.currentTarget.elements;
  storage.saveNotes('inputValue', input.value);
  storage.saveNotes('inputText', textarea.value);
  }

const addListItem = (event) => {
  event.preventDefault();
  const [input, text] = event.target.elements;
  const inputValue = input.value;
  const inputText = text.value;
  if(inputValue.trim() === '' || inputText.trim() === ''){
    ref.form.reset();
    return notyf.error(NOTIFICATION_MESSAGES.EDITOR_FIELDS_EMPTY);
  }

notepad.saveInput(inputValue, inputText).then(
  newNote => {
    addNoteList(ref.ul, newNote);
    notyf.success(NOTIFICATION_MESSAGES.NOTE_ADDED_SUCCESS);
  }
  ).catch(error => console.log(error));
  
  storage.removeNotes('inputValue');
  storage.removeNotes('inputText');
  ref.form.reset();
MicroModal.close('note-editor-modal');
}

const deleteListItem = element => {
  const deleteLi = element.closest("li");
  const liId = deleteLi.dataset.id;
  notepad.deleteNote(liId).then((deletedNote) => {
    deleteLi.remove();
    notyf.success(NOTIFICATION_MESSAGES.NOTE_DELETED_SUCCESS);
  }).catch(error => console.log(error));
};

const removeListItem = (event) => {
  const noteId = event.target.parentNode.dataset.action;
  if(noteId === NOTE_ACTIONS.DELETE){
    deleteListItem(event.target);
  }
}

const filterListItem = (event) => {
  notepad.filterNotesByQuery(event.target.value).then(
    filteredNotes => {
      renderFilteredNotes(ref.ul, filteredNotes);
    }
  ).catch(error => console.log(error));
}

// notepad.updateNotePriority("5XhsUnR", 3).then(updatedNote => {
//   console.log(updatedNote);
// })

// notepad.updateNoteContent("eSux6xY", {title: "asasas"}).then(updatedNote => {
//   console.log(updatedNote);
// })

  const openModal = () => {
    MicroModal.show('note-editor-modal');
  }

  ref.ul.addEventListener('click', removeListItem);
  ref.input.addEventListener('input', filterListItem);
  ref.form.addEventListener('submit', addListItem);
  ref.modal.addEventListener('click', openModal);
  ref.form.addEventListener('input', inputSave); 
  ref.modal.addEventListener('click', inputChecking);