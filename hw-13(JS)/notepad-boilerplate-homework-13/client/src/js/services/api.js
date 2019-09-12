const URL = "http://localhost:3000/notes";

export const getNotes = () => {
   return fetch(URL).then(response => {
        if (response.ok) {
            return response.json();
        }

        throw new Error(`Error while fetching ${response.statusText}`);
    })
};

export const saveNotes = (note) => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(note)
    };
    return fetch(URL, options).then(response => {
        if (response.ok) {
            return response.json();
        }

        throw new Error(`Error while fetching ${response.statusText}`);
    })
};

export const deleteNotes = (id) => {
    const options = {
        method: "DELETE"
    };
    return fetch(`${URL}/${id}`, options).then(response => {
        if (response.ok) {
            return response.json();
        }

        throw new Error(`Error while fetching ${response.statusText}`);
    })
};

export const updateNotes = (id, updatedNote) => {
    const options = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedNote)
    };
    return fetch(`${URL}/${id}`, options).then(response => {
        if (response.ok) {
            return response.json();
        }

        throw new Error(`Error while fetching ${response.statusText}`);
    })
};