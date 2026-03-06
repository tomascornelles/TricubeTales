/**
 * LocalStorage wrapper for multiple characters
 */
export const Store = {
    getAll: () => JSON.parse(localStorage.getItem('tt_chars') || '[]'),
    saveAll: (chars) => localStorage.setItem('tt_chars', JSON.stringify(chars)),
    getConfig: () => JSON.parse(localStorage.getItem('tt_config') || '{"lang":"en","theme":"light"}'),
    saveConfig: (cfg) => localStorage.setItem('tt_config', JSON.stringify(cfg)),
    addChar: (char) => {
        const all = Store.getAll();
        all.push(char);
        Store.saveAll(all);
        return char;
    }
};
