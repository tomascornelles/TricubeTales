import { translations } from './i18n.js';
import { Store } from './store.js';

let currentLang = 'en';
let character = null;
let isCreating = false;
let isEditingSheet = false;

const main = document.getElementById('main-content');
const modal = document.getElementById('dice-modal');

/** --- RENDERING LOGIC --- **/

function render() {
    if (!main) return;
    const t = translations[currentLang];
    const chars = Store.getAll();

    if (isCreating) {
        renderCreator(t);
    } else if (!character) {
        renderList(chars, t);
    } else {
        isEditingSheet ? renderEditView(t) : renderReadView(t);
    }
    document.getElementById('txt-title').innerText = t.title;
}

function renderList(chars, t) {
    const listHtml = chars.map(c => `
        <article style="padding: 1rem; margin-bottom: 1rem;">
            <div style="display:flex; justify-content: space-between; align-items:center">
                <a href="#" class="char-link" data-id="${c.id}">
                    <h4 style="margin:0">${c.name}</h4>
                    <small>${c.concept} (${t.traits[c.trait]})</small>
                </a>
                <button class="outline secondary" data-del="${c.id}" style="width:auto; padding:2px 10px; margin:0">✕</button>
            </div>
        </article>`).join('');

    main.innerHTML = `
        <section>
            <h2>${t.loadChar}</h2>
            ${listHtml || `<p>${t.noChars}</p>`}
            <button id="btn-to-creator" class="contrast" style="width:100%">${t.newCharTitle}</button>
        </section>`;

    main.querySelectorAll('.char-link').forEach(a => a.onclick = (e) => {
        e.preventDefault();
        character = chars.find(c => c.id == e.currentTarget.dataset.id);
        render();
    });
    main.querySelectorAll('[data-del]').forEach(b => b.onclick = (e) => {
        Store.saveAll(chars.filter(c => c.id != e.target.dataset.del));
        render();
    });
    document.getElementById('btn-to-creator').onclick = () => { isCreating = true; render(); };
}

function renderCreator(t) {
    const traitOpts = Object.entries(t.traits).map(([k,v]) => `<option value="${k}">${v}</option>`).join('');
    main.innerHTML = `
        <article>
            <h2>${t.newCharTitle}</h2>
            <form id="char-form">
                <label>${t.name} <input name="name" placeholder="${t.phName}" required></label>
                <label>${t.trait} <select name="trait">${traitOpts}</select></label>
                <label>${t.concept} <input name="concept" placeholder="${t.phConcept}" required></label>
                <label>${t.perk} <input name="perk" placeholder="${t.phPerk}" required></label>
                <label>${t.quirk} <input name="quirk" placeholder="${t.phQuirk}" required></label>
                <div class="grid"><button type="submit">${t.save}</button><button type="button" class="secondary outline" id="btn-cancel">${t.cancel}</button></div>
            </form>
        </article>`;
    
    document.getElementById('char-form').onsubmit = (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        character = Store.addChar({...Object.fromEntries(fd), karma: 3, resolve: 3, id: Date.now()});
        isCreating = false; render();
    };
    document.getElementById('btn-cancel').onclick = () => { isCreating = false; render(); };
}

function renderReadView(t) {
    main.innerHTML = `
        <article>
            <header style="display:flex; justify-content:space-between; align-items:start;">
                <div>
                    <h2 style="margin:0">${character.name}</h2>
                    <p style="margin:0; opacity:0.8">${character.concept}</small>
                    <p style="margin:0"><small>${t.traits[character.trait].toUpperCase()} | P: ${character.perk} | Q: ${character.quirk}</small></p>
                </div>
                <div style="display:flex; gap:0.5rem">
                    <button class="outline" id="btn-edit-mode" style="width:auto; margin:0">✏️</button>
                    <button class="outline" id="btn-back" style="width:auto; margin:0">${t.back}</button>
                </div>
            </header>
            <div class="grid-stats" style="margin: 1.5rem 0">
                <div class="stat-box">${t.karma}: <strong style="font-size:1.5rem">${character.karma}</strong></div>
                <div class="stat-box">${t.resolve}: <strong style="font-size:1.5rem">${character.resolve}</strong></div>
            </div>
            <footer><button id="btn-open-roll" style="width:100%">${t.rollBtn}</button></footer>
        </article>`;
    
    document.getElementById('btn-edit-mode').onclick = () => { isEditingSheet = true; render(); };
    document.getElementById('btn-back').onclick = () => { character = null; render(); };
    document.getElementById('btn-open-roll').onclick = () => openRollModal(t);
}

function renderEditView(t) {
    const traitOpts = Object.entries(t.traits).map(([k,v]) => `<option value="${k}" ${character.trait===k?'selected':''}>${v}</option>`).join('');
    main.innerHTML = `
        <article>
            <form id="edit-form">
                <h3>${t.edit}</h3>
                <label>${t.name} <input name="name" value="${character.name}" required></label>
                <div class="grid">
                    <label>${t.trait} <select name="trait">${traitOpts}</select></label>
                    <label>${t.concept} <input name="concept" value="${character.concept}" required></label>
                </div>
                <div class="grid">
                    <label>${t.perk} <input name="perk" value="${character.perk}"></label>
                    <label>${t.quirk} <input name="quirk" value="${character.quirk}"></label>
                </div>
                <div class="grid">
                    <label>${t.karma} <input type="number" name="karma" value="${character.karma}"></label>
                    <label>${t.resolve} <input type="number" name="resolve" value="${character.resolve}"></label>
                </div>
                <div class="grid">
                    <button type="submit">${t.update}</button>
                    <button type="button" class="secondary outline" id="btn-cancel-edit">${t.cancel}</button>
                </div>
            </form>
        </article>`;
    
    document.getElementById('edit-form').onsubmit = (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const updated = Object.fromEntries(fd);
        character = {...character, ...updated, karma: parseInt(updated.karma), resolve: parseInt(updated.resolve)};
        updateStore();
        isEditingSheet = false; render();
    };
    document.getElementById('btn-cancel-edit').onclick = () => { isEditingSheet = false; render(); };
}

/** --- ROLL LOGIC --- **/

function openRollModal(t) {
    document.getElementById('txt-roll-title').innerText = t.rollBtn;
    document.getElementById('txt-label-trait').innerText = t.trait;
    document.getElementById('txt-label-diff').innerText = t.diffs[5].split(' ')[0];
    document.getElementById('txt-check-concept').innerText = t.checkConcept;
    document.getElementById('txt-check-perk').innerText = t.checkPerk;
    document.getElementById('txt-btn-roll').innerText = t.rollBtn;
    document.getElementById('modal-trait-select').innerHTML = Object.entries(t.traits).map(([k,v]) => `<option value="${k}" ${character.trait===k?'selected':''}>${v}</option>`).join('');
    document.getElementById('modal-diff-select').innerHTML = Object.entries(t.diffs).map(([k,v]) => `<option value="${k}">${v}</option>`).join('');
    modal.open = true;
}

document.getElementById('roll-form').onsubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const t = translations[currentLang];
    const difficulty = parseInt(fd.get('difficulty'));
    const usePerk = fd.get('usePerk') === 'on';
    
    let dice = (fd.get('trait') === character.trait.toLowerCase()) ? 3 : 2;
    if (fd.get('useConcept') !== 'on') dice--;
    
    const rolls = Array.from({length: Math.max(1, dice)}, () => Math.floor(Math.random() * 6) + 1);
    const successCount = rolls.filter(v => v >= difficulty).length;
    const canQuirk = rolls.some(v => v === difficulty - 1) && character.karma > 0;
    
    document.getElementById('roll-output').classList.remove('hidden');
    document.getElementById('dice-values').innerText = rolls.join(' ');
    const act = document.getElementById('roll-actions'); act.innerHTML = '';
    
    document.getElementById('roll-message').innerText = successCount > 0 ? (successCount >= 2 ? t.exceptional : t.success) : t.failure;

    if (usePerk) {
        if (successCount > 0) {
            addActBtn(t.gainKarma, () => { character.karma++; finish(); });
            addActBtn(t.gainResolve, () => { character.resolve++; finish(); });
        } else { character.karma++; }
    }
    if (canQuirk) addActBtn(t.useQuirk, () => { character.karma--; finish(); }, "secondary");
    if (successCount === 0) {
        const loss = rolls.every(v => v === 1) ? 2 : 1;
        addActBtn(`${t.loseRes} (${loss})`, () => { character.resolve -= loss; finish(); });
    }
    if (act.innerHTML === '') addActBtn("OK", finish);
};

function addActBtn(txt, cb, cls="") {
    const b = document.createElement('button'); b.innerText = txt;
    if(cls) b.className = cls; b.onclick = cb;
    document.getElementById('roll-actions').appendChild(b);
}

const updateStore = () => {
    const all = Store.getAll();
    const i = all.findIndex(c => c.id === character.id);
    if(i !== -1) { all[i] = character; Store.saveAll(all); }
};

const finish = () => { updateStore(); render(); modal.open = false; document.getElementById('roll-output').classList.add('hidden'); };

document.getElementById('lang-selector').onchange = (e) => { currentLang = e.target.value; render(); };
document.getElementById('close-modal').onclick = () => modal.open = false;
document.addEventListener('DOMContentLoaded', render);
