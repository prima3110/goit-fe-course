import axios from "axios";

axios.defaults.baseURL = "http://localhost:3000/notes";

export const getNotes = async () => {
    try {
   const response = await axios.get();
   const data = await response.data;
   return data;
} catch(error) {
    throw new Error(`Error while requesting ${response.statusText}`);
    }
};

export const saveNotes = async (note) => {
    try {
        const response = await axios.post('', note);
        const data = await response.data;
        return data;
    } catch (error) {
        throw new Error(`Error while requesting ${response.statusText}`);
    }
};

export const deleteNotes = async (id) => {
    try {
        const response = await axios.delete(`/${id}`);
        const data = await response.data;
        return data;
    } catch(error){
        throw new Error(`Error while requesting ${response.statusText}`);
    }
};

export const updateNotes = async (id, updatedNote) => {
    try {
        const response = await axios.patch(`/${id}`, updatedNote);
        const data = await response.data;
        return data;
    } catch (error) {
        throw new Error(`Error while requesting ${response.statusText}`);
    }
};