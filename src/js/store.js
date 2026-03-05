/**
 * LocalStorage wrapper for multiple characters
 */
export const Store = {
    getAll: () => JSON.parse(localStorage.getItem('tt_collection') || '[]'),
    saveAll: (chars) => localStorage.setItem('tt_collection', JSON.stringify(chars)),
    addChar: (char) => {
        const chars = Store.getAll();
        char.id = Date.now(); // Unique ID
        chars.push(char);
        Store.saveAll(chars);
        return char;
    }
};
