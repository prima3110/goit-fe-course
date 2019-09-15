import {Notyf} from 'notyf';
import { NOTE_ACTIONS, NOTIFICATION_MESSAGES } from './utils/constants';
import Notepad from './utils/notepad-model';
import { ref } from './utils/ref';
import { renderNoteList, addNoteList, renderFilteredNotes } from './utils/view';
import MicroModal from 'micromodal';
import 'notyf/notyf.min.css';
import storage from './utils/storage';
import { async } from 'q';


const notepad = new Notepad();
const notyf = new Notyf();

const renderNotes = async () => {
  try {
    const notes = await notepad.getNotes();
    renderNoteList(ref.ul, notes);
  } catch(error) {
    notyf.error(error.message);
  }
}

renderNotes();
notyf.success('Привет, хозяин! :)')

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

const addListItem = async event => {
  event.preventDefault();
  const [input, text] = event.target.elements;
  const inputValue = input.value;
  const inputText = text.value;
  if(inputValue.trim() === '' || inputText.trim() === ''){
    ref.form.reset();
    return notyf.error(NOTIFICATION_MESSAGES.EDITOR_FIELDS_EMPTY);
  }
try{
const newNote = await notepad.saveInput(inputValue, inputText);
    addNoteList(ref.ul, newNote);
    notyf.success(NOTIFICATION_MESSAGES.NOTE_ADDED_SUCCESS);
  } catch(error) {
    notyf.error(error.message);
  };
  
  storage.removeNotes('inputValue');
  storage.removeNotes('inputText');
  ref.form.reset();
MicroModal.close('note-editor-modal');
}

const deleteListItem = async element => {
  const deleteLi = element.closest("li");
  const liId = deleteLi.dataset.id;
  try {
    await notepad.deleteNote(liId);
    deleteLi.remove();
    notyf.success(NOTIFICATION_MESSAGES.NOTE_DELETED_SUCCESS);
  } catch(error) {
    notyf.error(error.message);
  }
};

const removeListItem = (event) => {
  const noteId = event.target.parentNode.dataset.action;
  if(noteId === NOTE_ACTIONS.DELETE){
    deleteListItem(event.target);
  }
}

const filterListItem = async event => {
  try {
    const filteredNotes = await notepad.filterNotesByQuery(event.target.value);
    renderFilteredNotes(ref.ul, filteredNotes);
  } catch(error) {
    notyf.error(error.message);
  }
}

// notepad.updateNotePriority("4", 0).then(updatedNote => {
//   console.log(updatedNote);
// })

// notepad.updateNoteContent("4", {title: "Winter clothes"}).then(updatedNote => {
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