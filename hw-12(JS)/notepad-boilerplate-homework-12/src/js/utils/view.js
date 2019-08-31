import noteMarkup from '../../templates/note.hbs';

export const createNoteCard = initialNote => {
return noteMarkup(initialNote);
}

export const renderNoteList = (listRef, notes) => {
  const renderList = notes.map(elem => createNoteCard(elem));
  listRef.innerHTML = '';
  listRef.insertAdjacentHTML('beforeend', renderList.join(''));
}

