import {Notyf} from 'notyf';
import { NOTE_ACTIONS, NOTIFICATION_MESSAGES, PRIORITY_TYPES } from './utils/constants';
import Notepad from './utils/notepad-model';
import { ref } from './utils/ref';
import { renderNoteList, addNoteList, renderFilteredNotes } from './utils/view';
import MicroModal from 'micromodal';
import 'notyf/notyf.min.css';
import storage from './utils/storage';


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
notyf.success(NOTIFICATION_MESSAGES.NOTE_GREETING);

const openModal = () => {
  MicroModal.show('note-editor-modal');
  ref.form.classList.remove('edit');
  ref.form.classList.add('add');
  ref.form[0].value = '';
  ref.form[1].value = '';
  const [input, text] = ref.form.elements;
  const inputedTitle = storage.loadNotes('inputValue');
  const inputedBody = storage.loadNotes('inputText');
  if(inputedTitle || inputedBody){
    input.value = inputedTitle;
    text.value = inputedBody;
  };
}

const inputSave = (event) => {
  if(ref.form.classList.contains('add')){
    const [input, textarea] = event.currentTarget.elements;
    storage.saveNotes('inputValue', input.value);
    storage.saveNotes('inputText', textarea.value);
  }
  }

const addListItem = async event => {
  event.preventDefault();
  if(ref.form.classList.contains('add')){
  const [input, text] = event.target.elements;
  const inputValue = input.value;
  const inputText = text.value;
  if(inputValue.trim() === '' || inputText.trim() === ''){
    return notyf.error(NOTIFICATION_MESSAGES.EDITOR_FIELDS_EMPTY);
  }
try{
const newNote = await notepad.saveInput(inputValue, inputText);
    addNoteList(ref.ul, newNote);
    notyf.success(NOTIFICATION_MESSAGES.NOTE_ADDED_SUCCESS);
    storage.removeNotes('inputValue');
    storage.removeNotes('inputText');
    ref.form.reset();
    MicroModal.close('note-editor-modal');
  } catch(error) {
    notyf.error(error.message);
  };
}
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
  const noteAction = event.target.parentNode.dataset.action;
  if(noteAction === NOTE_ACTIONS.DELETE){
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

const openEditModal = async event => {
  const noteAction = event.target.parentNode.dataset.action;
  const idOfNote = event.target.closest('li').dataset.id;
  if(noteAction === NOTE_ACTIONS.EDIT){
    MicroModal.show('note-editor-modal');
    ref.form.classList.remove('add');
    ref.form.classList.add('edit');
    notepad.getId(idOfNote);
    const [input, text] = ref.form.elements;
    const notes = await notepad.getNotes();
    const updatedNote = await notes.find(note => note.id === Number(idOfNote));
    input.value = updatedNote.title;
    text.value = updatedNote.body;
  }
}
      
const updateListItem = async evt => {
if(ref.form.classList.contains('edit')){
  try{
  evt.preventDefault();
  const idOfNote = notepad.throwId();
  const [input, text] = ref.form.elements;
  const inputValue = input.value;
  const inputText = text.value;
  if(inputValue.trim() === '' || inputText.trim() === ''){
    return notyf.error(NOTIFICATION_MESSAGES.EDITOR_FIELDS_EMPTY);
  }
  const updatedNoteData = {
    title: inputValue,
    body: inputText
  };
  await notepad.updateNoteContent(idOfNote, updatedNoteData);
    renderNotes();
    notyf.success(NOTIFICATION_MESSAGES.NOTE_UPDATED_SUCCESS);
    storage.removeNotes('inputValue');
  storage.removeNotes('inputText');
  ref.form.reset();
  MicroModal.close('note-editor-modal');
  } catch (error){
    console.log(error);
  }
  }
} 

const changePriority = async event => {
  try{
  const noteAction = event.target.parentNode.dataset.action;
  const idOfNote = event.target.closest('li').dataset.id;
  if(noteAction === NOTE_ACTIONS.INCREASE_PRIORITY){
    notepad.getId(idOfNote);
    const notes = await notepad.getNotes();
    let changedPriorityNote = await notes.find(note => note.id === Number(idOfNote));
    changedPriorityNote.priority += 1;
    if(changedPriorityNote.priority > PRIORITY_TYPES.HIGH) return;
    await notepad.updateNotePriority(idOfNote, changedPriorityNote.priority);
    notyf.success(NOTIFICATION_MESSAGES.PRIORITY_INCREASED_SUCCESS);
    renderNotes();
  }
  if(noteAction === NOTE_ACTIONS.DECREASE_PRIORITY){
    notepad.getId(idOfNote);
    const notes = await notepad.getNotes();
    let changedPriorityNote = await notes.find(note => note.id === Number(idOfNote));
    changedPriorityNote.priority -= 1;
    if(changedPriorityNote.priority < PRIORITY_TYPES.LOW) return;
    await notepad.updateNotePriority(idOfNote, changedPriorityNote.priority);
    notyf.success(NOTIFICATION_MESSAGES.PRIORITY_DECREASED_SUCCESS);
    renderNotes();
  }
} catch (error) {
  console.log(error);
}
}
    
  ref.form.addEventListener('submit', updateListItem);
  ref.form.addEventListener('submit', addListItem);
  ref.form.addEventListener('input', inputSave); 
  ref.ul.addEventListener('click', removeListItem);
  ref.ul.addEventListener('click', openEditModal);
  ref.ul.addEventListener('click', changePriority);
  ref.modal.addEventListener('click', openModal);
  ref.input.addEventListener('input', filterListItem);