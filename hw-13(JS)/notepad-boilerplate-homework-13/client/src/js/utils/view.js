import noteMarkup from '../../templates/note.hbs';

 const createNoteCard = initialNote => {
  return noteMarkup(initialNote);
  };

  const createCardsNote = (notes) => {
    return notes.map(note => createNoteCard(note)).join('');
  };
  
  export const renderNoteList = (listRef, notes) => {
    listRef.innerHTML = '';
    listRef.insertAdjacentHTML('beforeend', createCardsNote(notes));
  };

 export const addNoteList = (listRef, note) => {
    const noteList = createNoteCard(note);
    listRef.insertAdjacentHTML('beforeend', noteList);
  };
  
  export const renderFilteredNotes = (listRef, notes) => {
    listRef.innerHTML = '';
    listRef.insertAdjacentHTML('beforeend', createCardsNote(notes));
  };