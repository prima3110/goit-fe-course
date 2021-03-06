import initialNotes from '../assets/notes.json';
import { NOTE_ACTIONS } from './utils/constants';
import Notepad from './utils/notepad-model';
import { ref } from './utils/ref';
import { renderNoteList, createListItem } from './utils/view';

const notepad = new Notepad(initialNotes);

//викликаємо функцію рендерингу і передаємо ссилку на елемент і масив заміток
renderNoteList(ref.ul, notepad.notes);

  //функція, яка створює нову замітку (при введенні заголовку і тексту, сабміт форми передає в функцію createListItem через аргумент newListItem) і додає її в список)
   const addListItem = (event) => {
    event.preventDefault();
    const [input, text] = event.target.elements;
    const inputValue = input.value;
    const inputText = text.value;
    if(inputValue.trim() === '' || inputText.trim() === ''){
    ref.form.reset();
    return alert('Необходимо заполнить все поля!');
    }
  
    const newListItem = notepad.addListItem(inputValue, inputText);
    const newNote = createListItem(newListItem);
    ref.ul.append(newNote);
    ref.form.reset();
  }

  const deleteListItem = element => {
    const deleteLi = element.closest("li");
    const liId = deleteLi.dataset.id;
    notepad.deleteNote(liId);
    deleteLi.remove();
  };
  
  //функція, яка порівнює значення в NOTE_ACTIONS.DELETE і в датасет батька вибраного елемента, якщо вони співпадать, то видаляє лі, в якому знаходться
  const removeListItem = (event) => {
    const noteId = event.target.parentNode.dataset.action;
    if(noteId === NOTE_ACTIONS.DELETE){
      deleteListItem(event.target);
    }
  }
  
  //функція, яка передає введені в інпут символи в функцію filterNotesByQuery для подальшої фільтрації і передає відфільтровані замітки в рендер renderNoteList
 const filterListItem = (event) => {
   const inputedText = notepad.filterNotesByQuery(event.target.value);
   renderNoteList(ref.ul, inputedText);
 }
 

  ref.ul.addEventListener('click', removeListItem);
  ref.input.addEventListener('input', filterListItem);
  ref.form.addEventListener('submit', addListItem);