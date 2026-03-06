import { translations } from './i18n.js';
import { Store } from './store.js';

let config = Store.getConfig();
let character = null;
let isCreating = false;
let isEditingSheet = false;

const main = document.getElementById('main-content');
const modal = document.getElementById('dice-modal');
const affModal = document.getElementById('affliction-modal');

/** --- THEME & NAV --- **/
function applyTheme() {
    document.body.setAttribute('data-theme', config.theme);
    const isDark = ['dark', 'scifi', 'cyberpunk'].includes(config.theme);
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
}

function updateNav(t) {
    document.getElementById('nav-title').innerHTML = `<strong>${t.title}</strong>`;
    const ts = document.getElementById('theme-selector');
    const ls = document.getElementById('lang-selector');
    ts.innerHTML = Object.entries(t.themes).map(([k,v]) => `<option value="${k}" ${config.theme===k?'selected':''}>${v}</option>`).join('');
    ls.innerHTML = `<option value="en" ${config.lang==='en'?'selected':''}>EN</option><option value="es" ${config.lang==='es'?'selected':''}>ES</option>`;
    ts.onchange = (e) => { config.theme = e.target.value; Store.saveConfig(config); render(); };
    ls.onchange = (e) => { config.lang = e.target.value; Store.saveConfig(config); render(); };
}

/** --- MAIN RENDER --- **/
function render() {
    applyTheme();
    const t = translations[config.lang];
    const chars = Store.getAll();
    updateNav(t);

    if (isCreating) renderCreator(t);
    else if (!character) renderList(chars, t);
    else isEditingSheet ? renderEditView(t) : renderDashboard(chars, t);
}

function renderList(chars, t) {
    main.innerHTML = `<section><h2>${t.loadChar}</h2>${chars.map(c => `
        <article style="display:flex; justify-content:space-between; align-items:center; padding:1rem;">
            <a href="#" class="char-link" data-id="${c.id}"><strong>${c.name}</strong><br><small>${c.concept}</small></a>
            <button class="outline secondary" data-del="${c.id}" style="width:auto; margin:0">✕</button>
        </article>`).join('') || `<p>${t.noChars}</p>`}
        <button id="btn-to-creator" class="contrast" style="width:100%">${t.newCharTitle}</button></section>`;
    
    main.querySelectorAll('.char-link').forEach(a => a.onclick = (e) => { e.preventDefault(); character = chars.find(c => c.id == e.currentTarget.dataset.id); render(); });
    main.querySelectorAll('[data-del]').forEach(b => b.onclick = (e) => { Store.saveAll(chars.filter(c => c.id != e.target.dataset.del)); render(); });
    document.getElementById('btn-to-creator').onclick = () => { isCreating = true; render(); };
}

function renderCreator(t) {
    const traitOpts = Object.entries(t.traits).map(([k,v]) => `<option value="${k}">${v}</option>`).join('');
    main.innerHTML = `<article><form id="char-form"><h2>${t.newCharTitle}</h2>
        <label>${t.name}<input name="name" required></label>
        <div class="grid"><label>${t.trait}<select name="trait">${traitOpts}</select></label><label>${t.concept}<input name="concept" required></label></div>
        <div class="grid"><button type="submit">${t.save}</button><button type="button" class="secondary outline" id="btn-cancel">${t.cancel}</button></div>
    </form></article>`;
    document.getElementById('char-form').onsubmit = (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        character = Store.addChar({...Object.fromEntries(fd), perks:[], quirks:[], afflictions:[], karma:3, maxKarma:3, resolve:3, maxResolve:3, id:Date.now()});
        isCreating = false; render();
    };
    document.getElementById('btn-cancel').onclick = () => { isCreating = false; render(); };
}

function renderDashboard(chars, t) {
    const charOptions = chars.map(c => `<option value="${c.id}" ${c.id===character.id?'selected':''}>${c.name}</option>`).join('');
    main.innerHTML = `
        <div class="dashboard-grid">
            <header class="full-width" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem">
                <select id="quick-char-select" style="width: auto; margin:0">${charOptions}</select>
                <div style="display:flex; gap:0.5rem"><button class="outline" id="btn-edit-mode">✏️</button><button class="outline" id="btn-back-menu">✕</button></div>
            </header>
            <article>
                <hgroup><h2>${character.name}</h2><p>${character.concept} | ${t.traits[character.trait]}</p></hgroup>
                <div class="grid">
                    <div class="stat-box"><small>${t.karma}</small><div style="display:flex; gap:8px; align-items:center; justify-content:center">
                        <button class="outline btn-karma" onclick="window.changeStat('karma',-1)">-</button><strong>${character.karma}</strong><button class="outline btn-karma" onclick="window.changeStat('karma',1)">+</button>
                    </div></div>
                    <div class="stat-box"><small>${t.resolve}</small><div style="display:flex; gap:8px; align-items:center; justify-content:center">
                        <button class="outline btn-resolve" onclick="window.changeStat('resolve',-1)">-</button><strong>${character.resolve}</strong><button class="outline btn-resolve" onclick="window.changeStat('resolve',1)">+</button>
                    </div></div>
                </div>
                <button id="btn-open-roll" style="margin-top:1.5rem; width:100%">${t.rollBtn}</button>
            </article>
            <div>
                <article style="border-left:4px solid #2e7d32; margin-bottom:1rem"><h5>⭐ ${t.perk}s</h5><ul style="font-size:0.9rem">${character.perks.map(p=>`<li>${p}</li>`).join('')||'<li>-</li>'}</ul></article>
                <article style="border-left:4px solid #c62828; margin-bottom:1rem"><h5>⚠️ ${t.quirk}s</h5><ul style="font-size:0.9rem">${character.quirks.map(q=>`<li>${q}</li>`).join('')||'<li>-</li>'}</ul></article>
                <article style="border-left:4px solid var(--primary)"><h5>🩹 ${t.afflictions}</h5>
                    ${character.afflictions.map((a,i)=>`<div class="affliction-item"><span>${a}</span><div style="display:flex; gap:4px">
                        <button class="outline" onclick="window.promoteAffliction(${i})" style="padding:2px 8px; margin:0">+</button>
                        <button class="outline secondary" onclick="window.removeAffliction(${i})" style="padding:2px 8px; margin:0">✕</button>
                    </div></div>`).join('') || '<p>-</p>'}
                </article>
            </div>
        </div>`;
    document.getElementById('quick-char-select').onchange = (e) => { character = chars.find(c => c.id == e.target.value); render(); };
    document.getElementById('btn-edit-mode').onclick = () => { isEditingSheet = true; render(); };
    document.getElementById('btn-back-menu').onclick = () => { character = null; render(); };
    document.getElementById('btn-open-roll').onclick = () => openRollModal(t);
}

function renderEditView(t) {
    const traitOpts = Object.entries(t.traits).map(([k,v]) => `<option value="${k}" ${character.trait===k?'selected':''}>${v}</option>`).join('');
    main.innerHTML = `<article><form id="edit-form">
        <h3>${t.edit}</h3>
        <label>${t.name}<input name="name" value="${character.name}" required></label>
        <div class="grid"><label>${t.trait}<select name="trait">${traitOpts}</select></label><label>${t.concept}<input name="concept" value="${character.concept}" required></label></div>
        <div class="grid"><label>${t.maxKarma}<input type="number" name="maxKarma" value="${character.maxKarma}"></label><label>${t.maxResolve}<input type="number" name="maxResolve" value="${character.maxResolve}"></label></div>
        <div class="grid"><label>${t.perksEdit}<textarea name="perks">${character.perks.join('\n')}</textarea></label><label>${t.quirksEdit}<textarea name="quirks">${character.quirks.join('\n')}</textarea></label></div>
        <label>${t.afflictionsEdit}<textarea name="afflictions">${character.afflictions.join('\n')}</textarea></label>
        <div class="grid"><button type="submit">${t.update}</button><button type="button" class="secondary outline" id="btn-cancel-edit">${t.cancel}</button></div>
    </form></article>`;
    document.getElementById('edit-form').onsubmit = (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const parseLines = (n) => fd.get(n).split('\n').map(s=>s.trim()).filter(s=>s);
        character = {...character, name:fd.get('name'), trait:fd.get('trait'), concept:fd.get('concept'), maxKarma:parseInt(fd.get('maxKarma')), maxResolve:parseInt(fd.get('maxResolve')), perks:parseLines('perks'), quirks:parseLines('quirks'), afflictions:parseLines('afflictions')};
        isEditingSheet = false; checkAndPersist();
    };
    document.getElementById('btn-cancel-edit').onclick = () => { isEditingSheet = false; render(); };
}

/** --- STATS & LOGIC --- **/
window.changeStat = (s, d) => { 
    character[s] = Math.min(Math.max(0, character[s]+d), character[s==='karma'?'maxKarma':'maxResolve']); 
    checkAndPersist(); 
};
window.removeAffliction = (i) => { character.afflictions.splice(i,1); checkAndPersist(); };
window.promoteAffliction = (i) => { character.quirks.push(character.afflictions.splice(i,1)[0]); checkAndPersist(); };

function checkAndPersist() {
    const t = translations[config.lang];
    if (character.resolve <= 0) {
        character.resolve = character.maxResolve;
        document.getElementById('txt-affliction-title').innerText = t.resolveZero;
        document.getElementById('txt-label-affliction').innerText = t.promptAffliction;
        document.getElementById('txt-btn-add-aff').innerText = t.add;
        document.getElementById('affliction-input').value = t.defaultAffliction;
        affModal.open = true;
        document.getElementById('affliction-form').onsubmit = (e) => {
            e.preventDefault();
            character.afflictions.push(new FormData(e.target).get('afflictionName') || t.defaultAffliction);
            affModal.open = false; finalizeSave();
        };
        return;
    }
    finalizeSave();
}

function finalizeSave() {
    const all = Store.getAll();
    const i = all.findIndex(c => c.id === character.id);
    if(i !== -1) all[i] = character;
    Store.saveAll(all);
    render();
}

/** --- DICE LOGIC --- **/
function openRollModal(t) {
    document.getElementById('txt-roll-title').innerText = t.rollBtn;
    document.getElementById('txt-check-concept').innerText = t.checkConcept;
    document.getElementById('txt-check-perk').innerText = t.checkPerk;
    document.getElementById('txt-btn-roll').innerText = t.rollBtn;
    document.getElementById('modal-trait-select').innerHTML = Object.entries(t.traits).map(([k,v])=>`<option value="${k}" ${character.trait===k?'selected':''}>${v}</option>`).join('');
    document.getElementById('modal-diff-select').innerHTML = Object.entries(t.diffs).map(([k,v])=>`<option value="${k}" ${k==='5'?'selected':''}>${v}</option>`).join('');
    document.getElementById('roll-output').classList.add('hidden');
    modal.open = true;
}

document.getElementById('roll-form').onsubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const t = translations[config.lang];
    const diff = parseInt(fd.get('difficulty'));
    const usePerk = fd.get('usePerk') === 'on';

    let dice = (fd.get('trait') === character.trait) ? 3 : 2;
    if (fd.get('useConcept') !== 'on') dice--;
    
    const rolls = Array.from({length: Math.max(1, dice)}, () => Math.floor(Math.random()*6)+1);
    const hits = rolls.filter(v => v >= diff).length;
    const canQuirk = rolls.some(v => v === diff - 1) && character.karma > 0;

    document.getElementById('roll-output').classList.remove('hidden');
    document.getElementById('dice-values').innerText = rolls.join(' ');
    document.getElementById('roll-message').innerText = hits > 0 ? (hits >= 2 ? t.exceptional : t.success) : t.failure;
    
    const act = document.getElementById('roll-actions'); act.innerHTML = '';
    const addBtn = (txt, cb, cls="") => { const b = document.createElement('button'); b.innerText = txt; if(cls) b.className=cls; b.onclick = cb; act.appendChild(b); };

    if (usePerk) {
        if (hits > 0) {
            addBtn(t.gainKarma, () => { character.karma++; modal.open=false; checkAndPersist(); });
            addBtn(t.gainResolve, () => { character.resolve++; modal.open=false; checkAndPersist(); });
        } else { character.karma++; }
    }
    
    if (canQuirk) addBtn(t.useQuirk, () => { character.karma--; modal.open=false; checkAndPersist(); }, "secondary");
    
    if (hits === 0 && !usePerk) {
        const loss = rolls.every(v => v === 1) ? 2 : 1;
        addBtn(`${t.loseRes} (${loss})`, () => { character.resolve -= loss; modal.open=false; checkAndPersist(); });
    }

    addBtn("OK", () => { modal.open = false; checkAndPersist(); });
};

document.getElementById('close-modal').onclick = () => modal.open = false;
document.addEventListener('DOMContentLoaded', render);
