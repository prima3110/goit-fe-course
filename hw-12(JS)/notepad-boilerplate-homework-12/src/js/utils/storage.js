const loadNotes = (key) => {
    try {
      const load = localStorage.getItem(key);
  
      return JSON.parse(load);
    } catch (err) {
      console.error('Loading notes error: ', err);
    }
  };
  
  const saveNotes = (key, value) => {
    try {
      const save = JSON.stringify(value);
      localStorage.setItem(key, save);
    } catch (err) {
      console.error('Saving note error: ', err);
    }
  };

  const removeNotes = (key) => {
    try {
      return localStorage.removeItem(key);
    } catch (err) {
      console.error('Removing note error: ', err);
    }
  };
  
  export default {loadNotes, saveNotes, removeNotes};