import {Notyf} from 'notyf';
// import initialNotes from '../assets/notes.json';
import { NOTE_ACTIONS, NOTIFICATION_MESSAGES } from './utils/constants';
import Notepad from './utils/notepad-model';
import { ref } from './utils/ref';
import { renderNoteList, createNoteCard } from './utils/view';
import MicroModal from 'micromodal';
import 'notyf/notyf.min.css';
import storage from './utils/storage';


const notepad = new Notepad(storage.loadNotes('newNotesAdded'));
const notyf = new Notyf();

renderNoteList(ref.ul, notepad.notes);

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

notepad.addNote(inputValue, inputText).then(
  newNote => {
    ref.ul.insertAdjacentHTML('beforeend', createNoteCard(newNote));
    storage.saveNotes('newNotesAdded', notepad.notes)
    ref.form.reset();
    notyf.success(NOTIFICATION_MESSAGES.NOTE_ADDED_SUCCESS);
  }
).catch(error => console.log(error));

storage.removeNotes('inputValue');
storage.removeNotes('inputText');
MicroModal.close('note-editor-modal');
}

const deleteListItem = element => {
  const deleteLi = element.closest("li");
  const liId = deleteLi.dataset.id;
  notepad.deleteNote(liId).then(
    newNotes => {
      deleteLi.remove();
      storage.saveNotes('newNotesAdded', newNotes);
      notyf.success(NOTIFICATION_MESSAGES.NOTE_DELETED_SUCCESS);
    }
    ).catch(error => console.log(error));
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
      renderNoteList(ref.ul, filteredNotes);
    }
  ).catch(error => console.log(error));
}

  const openModal = () => {
    MicroModal.show('note-editor-modal');
  }

  ref.ul.addEventListener('click', removeListItem);
  ref.input.addEventListener('input', filterListItem);
  ref.form.addEventListener('submit', addListItem);
  ref.modal.addEventListener('click', openModal);
  ref.form.addEventListener('input', inputSave); 
  ref.modal.addEventListener('click', inputChecking);