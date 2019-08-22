import { ICON_TYPES, NOTE_ACTIONS } from './constants';
  
  //функція, яка сама буде створювати теги з класами
   const createElement = (tag, className) => {
    const createElement = document.createElement(tag);
    // createElement.classList.add(className);
    className.split(' ').map(e => createElement.classList.add(e));
    return createElement;
  };
  
  //функція createNoteContent
   const createNoteContent = note => {
  
    //note__content
    const noteContent = createElement('div', 'note__content');
    //note__title
    const title = createElement('h2', 'note__title');
    title.textContent = note.title;
    //note__body
    const body = createElement('p', 'note__body');
    body.textContent = note.body;
    //appends
    noteContent.append(title, body);
  
  
    return noteContent;
  }
  
  //функція createActionButton
   const createActionButton = (data, icon) => {
    //action
    const buttonAction = createElement('button', 'action');
    buttonAction.dataset.action = data;
  
    //icon
    const materialIcon = createElement('i', 'material-icons');
    materialIcon.classList.add('action__icon');
    materialIcon.textContent = icon;
  
    //appends
    buttonAction.append(materialIcon);
  
    return buttonAction;
  
  }
  
  //функція createNoteFooter
   const createNoteFooter = (priority) => {
  
    //note__footer
    const noteFooter = createElement('footer', 'note__footer');
  
    //note__section
    const noteSectionOne = createElement('section', 'note__section');
    const noteSectionTwo = createElement('section', 'note__section');
  
  
    //note__priority
    const notePriority = createElement('span', 'note__priority');
    notePriority.textContent = priority;
  
    //appends
    noteSectionOne.append(createActionButton(NOTE_ACTIONS.DECREASE_PRIORITY, ICON_TYPES.ARROW_DOWN), createActionButton(NOTE_ACTIONS.INCREASE_PRIORITY, ICON_TYPES.ARROW_UP));
    noteSectionOne.append(notePriority);
    noteSectionTwo.append(createActionButton(NOTE_ACTIONS.EDIT, ICON_TYPES.EDIT), createActionButton(NOTE_ACTIONS.DELETE, ICON_TYPES.DELETE));
    
    noteFooter.append(noteSectionOne, noteSectionTwo);
  
    return noteFooter;
  }
  
  //фукнція createListItem
  export const createListItem = note => {
  
    //note
    const noteDiv = createElement('div', 'note');
    //note-list__item
    const listItem = createElement('li', 'note-list__item');
  
    //appends
    noteDiv.append(createNoteContent(note));
    noteDiv.append(createNoteFooter(note.priority));
  
    listItem.append(noteDiv);
  
    return listItem;
  
  };

  //функція, яка приймає ссилку на елемент ul.note-list і масив обєктів заміток
//і викликає createListItem(note) стільки разів, скільки обєктів в масиві
//після чого додає всі карточки в список
export const renderNoteList = (listRef, notes) => {
  //перебираємо масив заміток, викликаємо функція для створення і передаємо їй замітку (n-кількість)
  const renderList = notes.map(elem => createListItem(elem));
  listRef.innerHTML = '';
  //додаємо замітки в список (розпилюємо li в ul)
  listRef.append(...renderList);
}
