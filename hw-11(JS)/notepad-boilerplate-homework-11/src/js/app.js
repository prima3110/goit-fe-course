import {Notyf} from 'notyf';
import initialNotes from '../assets/notes.json';
import { NOTE_ACTIONS, NOTIFICATION_MESSAGES } from './utils/constants';
import Notepad from './utils/notepad-model';
import { ref } from './utils/ref';
import { renderNoteList, createNoteCard } from './utils/view';
import MicroModal from 'micromodal';
import 'notyf/notyf.min.css';

const notepad = new Notepad(initialNotes);
const notyf = new Notyf();

renderNoteList(ref.ul, notepad.notes);

const addListItem = (event) => {
  event.preventDefault();
  const [input, text] = event.target.elements;
  const inputValue = input.value;
  const inputText = text.value;
  if(inputValue.trim() === '' || inputText.trim() === ''){
    ref.form.reset();
    return notyf.error(NOTIFICATION_MESSAGES.EDITOR_FIELDS_EMPTY);
  }
  
  const newListItem = notepad.addListItem(inputValue, inputText);
  const newNote = createNoteCard(newListItem);
  ref.ul.insertAdjacentHTML('beforeend', newNote);
  ref.form.reset();
  notyf.success(NOTIFICATION_MESSAGES.NOTE_ADDED_SUCCESS);
  MicroModal.close('note-editor-modal');
}

const deleteListItem = element => {
  const deleteLi = element.closest("li");
  const liId = deleteLi.dataset.id;
  notepad.deleteNote(liId);
  deleteLi.remove();
  notyf.success(NOTIFICATION_MESSAGES.NOTE_DELETED_SUCCESS);
};

const removeListItem = (event) => {
  const noteId = event.target.parentNode.dataset.action;
  if(noteId === NOTE_ACTIONS.DELETE){
    deleteListItem(event.target);
  }
}

const filterListItem = (event) => {
  const inputedText = notepad.filterNotesByQuery(event.target.value);
  renderNoteList(ref.ul, inputedText);
}

  const openModal = () => {
    MicroModal.show('note-editor-modal');
  }

  ref.ul.addEventListener('click', removeListItem);
  ref.input.addEventListener('input', filterListItem);
  ref.form.addEventListener('submit', addListItem);
  ref.modal.addEventListener('click', openModal);
