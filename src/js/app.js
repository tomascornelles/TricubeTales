import { translations } from './i18n.js';
import { Store } from './store.js';

let currentLang = 'en';
let character = null;
let isCreating = false;

// Pre-bind elements to avoid repeated lookups
const main = document.getElementById('main-content');
const modal = document.getElementById('dice-modal');

/**
 * Robust render function with error checking
 */
function render() {
    try {
        if (!main) throw new Error("Main container not found");
        const t = translations[currentLang];
        const chars = Store.getAll();

        if (isCreating) {
            renderCreator(t);
        } else if (!character) {
            renderList(chars, t);
        } else {
            renderDashboard(t);
        }

        document.getElementById('txt-title').innerText = t.title;
    } catch (err) {
        console.error("Render error:", err);
    }
}

function renderCreator(t) {
    const traitOptions = Object.entries(t.traits).map(([k, v]) => `<option value="${k}">${v}</option>`).join('');
    main.innerHTML = `
    <article>
    <h2>${t.newCharTitle}</h2>
    <form id="char-form">
    <label>${t.trait}</label>
    <select name="trait">${traitOptions}</select>
    <label>${t.concept}</label>
    <input name="concept" placeholder="${t.phConcept}" required>
    <label>${t.quirk}</label>
    <input name="quirk" placeholder="${t.phQuirk}" required>
    <label>${t.perk}</label>
    <input name="perk" placeholder="${t.phPerk}" required>
    <div class="grid">
    <button type="submit">${t.save}</button>
    <button type="button" class="secondary outline" id="btn-cancel">${t.cancel}</button>
    </div>
    </form>
    </article>`;

    document.getElementById('char-form').onsubmit = (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        character = Store.addChar({...Object.fromEntries(fd), karma: 3, resolve: 3});
        isCreating = false;
        render();
    };
    document.getElementById('btn-cancel').onclick = () => { isCreating = false; render(); };
}

function renderList(chars, t) {
    const listHtml = chars.map(c => `
    <li>
    <div style="display:flex; justify-content: space-between; align-items:center">
    <a href="#" class="char-link" data-id="${c.id}"><strong>${c.concept}</strong> <small>(${t.traits[c.trait] || c.trait})</small></a>
    <button class="outline secondary" data-del="${c.id}" style="width:auto; padding:2px 10px; margin:0">✕</button>
    </div>
    </li>`).join('');

    main.innerHTML = `
    <article>
    <h2>${t.loadChar}</h2>
    <ul style="list-style:none; padding:0">${listHtml || `<li>${t.noChars}</li>`}</ul>
    <footer><button id="btn-to-creator" class="contrast">${t.newCharTitle}</button></footer>
    </article>`;

    main.querySelectorAll('.char-link').forEach(a => a.onclick = (e) => {
        e.preventDefault();
        const id = e.currentTarget.dataset.id;
        character = chars.find(c => c.id == id);
        render();
    });

    main.querySelectorAll('[data-del]').forEach(b => b.onclick = (e) => {
        Store.saveAll(chars.filter(c => c.id != e.target.dataset.del));
        render();
    });

    document.getElementById('btn-to-creator').onclick = () => { isCreating = true; render(); };
}

function renderDashboard(t) {
    main.innerHTML = `
    <article>
    <header style="display:flex; justify-content:space-between; align-items:center">
    <div>
    <h3 style="margin:0">${character.concept}</h3>
    <small>${t.traits[character.trait].toUpperCase()} | ${character.perk} | ${character.quirk}</small>
    </div>
    <button class="outline" id="btn-back" style="width:auto; margin:0">${t.back}</button>
    </header>
    <div class="grid-stats" style="margin-top:1rem">
    <div>${t.karma}: <strong>${character.karma}</strong></div>
    <div>${t.resolve}: <strong>${character.resolve}</strong></div>
    </div>
    <footer><button id="btn-open-roll">${t.rollBtn}</button></footer>
    </article>`;

    document.getElementById('btn-back').onclick = () => { character = null; render(); };
    document.getElementById('btn-open-roll').onclick = () => openRollModal(t);
}

function openRollModal(t) {
    document.getElementById('txt-roll-title').innerText = t.rollBtn;
    document.getElementById('txt-label-trait').innerText = t.trait;
    document.getElementById('txt-label-diff').innerText = t.trait; // label
    document.getElementById('txt-check-concept').innerText = t.checkConcept || "Concept";
    document.getElementById('txt-check-perk').innerText = t.checkPerk;
    document.getElementById('txt-btn-roll').innerText = t.rollBtn;

    document.getElementById('modal-trait-select').innerHTML = Object.entries(t.traits).map(([k,v]) => `<option value="${k}">${v}</option>`).join('');
    document.getElementById('modal-diff-select').innerHTML = Object.entries(t.diffs).map(([k,v]) => `<option value="${k}">${v}</option>`).join('');

    modal.open = true;
}

// Roll logic (unchanged logic but wrapped for safety)
document.getElementById('roll-form').onsubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const t = translations[currentLang];
    const difficulty = parseInt(fd.get('difficulty'));
    const usePerk = fd.get('usePerk') === 'on';

    let dice = (fd.get('trait') === character.trait.toLowerCase()) ? 3 : 2;
    if (fd.get('useConcept') !== 'on') dice--;
    dice = Math.max(1, dice);

    const rolls = Array.from({length: dice}, () => Math.floor(Math.random() * 6) + 1);
    const canQuirk = rolls.some(v => v === difficulty - 1) && character.karma > 0;

    document.getElementById('roll-output').classList.remove('hidden');
    document.getElementById('dice-values').innerText = rolls.join(' ');

    const act = document.getElementById('roll-actions');
    act.innerHTML = '';

    const successes = rolls.filter(v => v >= difficulty).length;
    const isCritFail = rolls.every(v => v === 1);

    document.getElementById('roll-message').innerText = successes > 0 ? t.success : t.failure;

    if (usePerk) {
        if (successes > 0) {
            addBtn(t.gainKarma, () => { character.karma++; finish(); });
            addBtn(t.gainResolve, () => { character.resolve++; finish(); });
        } else {
            character.karma++;
        }
    }

    if (canQuirk) addBtn(t.useQuirk, () => { character.karma--; finish(); }, "secondary");

    if (successes === 0) {
        const loss = isCritFail ? 2 : 1;
        addBtn(`${t.loseRes} (${loss})`, () => { character.resolve -= loss; finish(); });
    }

    if (act.innerHTML === '') addBtn("OK", finish);
};

function addBtn(txt, cb, cls="") {
    const b = document.createElement('button');
    b.innerText = txt;
    if(cls) b.className = cls;
    b.onclick = cb;
    document.getElementById('roll-actions').appendChild(b);
}

function finish() {
    const all = Store.getAll();
    const i = all.findIndex(c => c.id === character.id);
    if(i !== -1) all[i] = character;
    Store.saveAll(all);
    render();
    modal.open = false;
    document.getElementById('roll-output').classList.add('hidden');
}

// Initializing
document.getElementById('lang-selector').onchange = (e) => {
    currentLang = e.target.value;
    render();
};

document.getElementById('close-modal').onclick = () => modal.open = false;

// CRITICAL: Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    console.log("App loaded");
    render();
});
