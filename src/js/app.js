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
    const tSolo = translations[config.lang].solo || { types: {}, suits: {} };
    const history = character.sceneHistory || [];
    const current = character.currentCard;

    // Construcción del HTML de las Cartas (Pág 2 PDF)
    const soloHTML = `
    <article class="solo-container" style="border: 2px dashed var(--primary); padding: 0.8rem; margin-top: 1rem;">
        <h6 style="margin-bottom: 0.5rem;">🃏 ${tSolo.sceneManager || 'Gestión de Escenas'}</h6>
        
        ${current ? `
            <div style="text-align:center; padding:1rem; background:rgba(0,0,0,0.05); border-radius:8px; border: 1px solid var(--primary);">
                <h2 style="margin:0; color:${['H','D'].includes(current.s) ? '#c62828' : 'inherit'}">
                    ${current.v}${window.getSuitIcon(current.s)}
                </h2>
                <p style="margin: 0.5rem 0;"><small>${tSolo.types[current.v] || 'Desafío'}</small></p>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <button onclick="window.resolveScene(true)" style="margin:0">✅ ${tSolo.win || 'Éxito'}</button>
                    <button class="secondary" onclick="window.resolveScene(false)" style="margin:0">❌ ${tSolo.lose || 'Fallo'}</button>
                </div>
            </div>
        ` : `
            <button class="contrast" onclick="window.drawSceneCard()" style="width:100%">${tSolo.drawCard || 'Sacar Carta de Escena'}</button>
        `}

        <div style="margin-top:0.8rem; display:flex; gap:5px; flex-wrap:wrap; justify-content: center;">
            ${history.map(c => `
                <span style="opacity:${c.success ? 1 : 0.3}; font-size: 1.2rem;" title="${c.v}${c.s}">
                    ${c.v}${window.getSuitIcon(c.s)}
                </span>
            `).join('')}
        </div>
    </article>
    `;

    // Renderizado principal del Dashboard
    main.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem">
        <button class="outline" onclick="character=null;render()" style="padding:0.2rem 0.5rem; margin:0">← ${t.back}</button>
        <button class="outline" onclick="isEditingSheet=true;render()" style="padding:0.2rem 0.5rem; margin:0">✏️ ${t.edit}</button>
    </div>
    
    <article>
        <header>
            <h4 style="margin:0">${character.name}</h4>
            <small>${character.concept}</small>
        </header>
        
        <div class="grid">
            <div style="text-align:center; border:1px solid var(--primary); padding:0.5rem; border-radius:8px">
                <small>${t.karma}</small>
                <div style="display:flex; align-items:center; justify-content:center; gap:10px">
                    <button class="outline" onclick="changeStat('karma',-1)" style="padding:0 0.5rem">-</button>
                    <strong>${character.karma}</strong>
                    <button class="outline" onclick="changeStat('karma',1)" style="padding:0 0.5rem">+</button>
                </div>
            </div>
            <div style="text-align:center; border:1px solid var(--primary); padding:0.5rem; border-radius:8px">
                <small>${t.resolve}</small>
                <div style="display:flex; align-items:center; justify-content:center; gap:10px">
                    <button class="outline" onclick="changeStat('resolve',-1)" style="padding:0 0.5rem">-</button>
                    <strong>${character.resolve}</strong>
                    <button class="outline" onclick="changeStat('resolve',1)" style="padding:0 0.5rem">+</button>
                </div>
            </div>
        </div>

        <button onclick="openRollModal()" style="margin-top:1rem; width:100%">${t.rollBtn}</button>
        
        ${soloHTML} 
    </article>

    <div class="grid">
        <article><h6>${t.perk}s</h6><ul>${character.perks.map(p=>`<li>${p}</li>`).join('')}</ul></article>
        <article><h6>${t.quirk}s</h6><ul>${character.quirks.map(q=>`<li>${q}</li>`).join('')}</ul></article>
    </div>
    
    <article>
        <h6>${t.afflictions}</h6>
        <div style="display:flex; flex-wrap:wrap; gap:0.5rem">
            ${character.afflictions.map((a,i)=>`
                <mark style="padding:0.2rem 0.5rem; border-radius:4px; display:flex; align-items:center; gap:5px">
                    ${a} <span style="cursor:pointer; font-weight:bold" onclick="removeAffliction(${i})">×</span>
                </mark>
            `).join('')}
        </div>
    </article>`;
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

// --- LÓGICA DEL ORÁCULO (Pág. 1 del PDF) ---
window.rollOracle = () => {
    const target = parseInt(document.getElementById('oracle-prob').value);
    const d6 = Math.floor(Math.random() * 6) + 1;
    const caveatRoll = Math.floor(Math.random() * 6) + 1;
    
    const isYes = d6 >= target;
    const output = document.getElementById('oracle-output');
    const answer = document.getElementById('oracle-answer');
    const caveat = document.getElementById('oracle-caveat');

    output.classList.remove('hidden');
    answer.innerText = isYes ? "SÍ" : "NO";
    answer.style.color = isYes ? "var(--primary)" : "#c62828";

    // Regla "Adding a Caveat" (Pág 1): 1-2 = Pero..., 5-6 = Y además...
    if (caveatRoll <= 2) caveat.innerText = "...pero (but)";
    else if (caveatRoll >= 5) caveat.innerText = "...y además (and)";
    else caveat.innerText = "";
};

window.runIntermission = (type) => {
    if (type === 'relax') {
        // Relajarse (Pág 2): Recupera Resolve pero 1 en 6 de problema
        character.resolve = character.maxResolve;
        const problem = Math.floor(Math.random() * 6) + 1 === 1;
        alert("Te has relajado: Resolución al máximo." + (problem ? "\n⚠️ ¡Pero algo ha ido mal!" : ""));
    } else {
        // Planear (Pág 2): Gana 1 Karma
        character.karma = Math.min(character.karma + 1, character.maxKarma);
        alert("Has trazado un plan: +1 Karma.");
    }
    checkAndPersist();
};

window.generateTwist = () => {
    // Tabla de Giros (Twists) sugerida en el PDF
    const twists = [
        "Un nuevo peligro aparece",
        "Un NPC cambia de actitud",
        "Algo no es lo que parece",
        "Aparece una complicación física",
        "El tiempo se agota",
        "Un recurso se pierde o rompe"
    ];
    alert("GIRO ARGUMENTAL:\n" + twists[Math.floor(Math.random()*twists.length)]);
};

window.advanceScene = () => {
    const t = translations[config.lang];
    // Actualizamos textos del modal de intermedio antes de abrir
    document.getElementById('txt-intermission-title').innerText = t.intermissionTitle || "Intermission";
    document.getElementById('txt-relax-desc').innerText = t.relaxDesc || "Recover all Resolve, but roll 1d6: on a 1, a complication occurs.";
    document.getElementById('txt-plan-desc').innerText = t.planDesc || "Gain +1 Karma while you prepare your next move.";
    
    document.getElementById('intermission-modal').showModal();
};

window.handleIntermission = (type) => {
    const t = translations[config.lang];
    if (type === 'relax') {
        character.resolve = character.maxResolve;
        // Regla PDF: 1 en d6 es complicación
        const roll = Math.floor(Math.random() * 6) + 1;
        if (roll === 1) {
            alert("⚠️ " + (t.relaxComplication || "Complication! Something went wrong while resting."));
        } else {
            alert("✅ " + (t.confirmRelax || "Recovered to Max Resolve."));
        }
    } else if (type === 'plan') {
        character.karma = Math.min(character.karma + 1, character.maxKarma);
        alert("✅ " + (t.confirmPlan || "Gained +1 Karma."));
    }
    
    // Avanzar contador de escena
    character.scene = (character.scene || 1) + 1;
    document.getElementById('intermission-modal').close();
    
    // USAMOS EL NOMBRE CORRECTO DE TU ARCHIVO
    checkAndPersist(); 
};

const originalAddChar = Store.addChar;
Store.addChar = (char) => {
    if (!char.scene) char.scene = 1;
    return originalAddChar(char);
};

// --- MOTOR DE CARTAS SOLO (Pág. 2 PDF) ---
window.getSuitIcon = (s) => {
    const icons = { 'H': '♥️', 'D': '♦️', 'S': '♠️', 'C': '♣️' };
    return icons[s] || s;
};

window.drawSceneCard = () => {
    const VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const SUITS = ['H', 'D', 'S', 'C'];

    if (!character.deck || character.deck.length === 0) {
        character.deck = [];
        SUITS.forEach(s => VALUES.forEach(v => character.deck.push({v, s})));
    }

    const idx = Math.floor(Math.random() * character.deck.length);
    const card = character.deck.splice(idx, 1)[0];
    
    character.currentCard = card;
    character.sceneHistory = character.sceneHistory || [];

    // Si es J, Q, K, A (Figuras)
    if (['J', 'Q', 'K', 'A'].includes(card.v)) {
        alert("¡EVENTO ESPECIAL!\n" + card.v + window.getSuitIcon(card.s));
    }
    
    checkAndPersist(); // Esto guardará y re-renderizará
};

window.resolveScene = (success) => {
    character.sceneHistory.push({ ...character.currentCard, success });
    character.currentCard = null;
    checkAndPersist();
};

document.getElementById('close-modal').onclick = () => modal.open = false;
document.addEventListener('DOMContentLoaded', render);
