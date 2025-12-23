// UI update functions and documentation system
import { WORLD, ITEMS } from './world.js';
import { CONVERSATIONS } from './conversations.js';
import { Sound } from './sound.js';
import { EVIDENCE_CONNECTIONS } from './config.js';

// These will be set by main.js
export let STATE = null;
export let outputEl = null;
export let locEl = null;
export let turnEl = null;
export let invEl = null;
export let notesEl = null;
export let evCountEl = null;
export let docCharsEl = null;
export let docEvidenceEl = null;
export let docScenesEl = null;
export let isTyping = false;

export function initUI(state, domElements) {
    STATE = state;
    outputEl = domElements.outputEl;
    locEl = domElements.locEl;
    turnEl = domElements.turnEl;
    invEl = domElements.invEl;
    notesEl = domElements.notesEl;
    evCountEl = domElements.evCountEl;
    docCharsEl = domElements.docCharsEl;
    docEvidenceEl = domElements.docEvidenceEl;
    docScenesEl = domElements.docScenesEl;
}

export function updateUI() {
    locEl.innerText = WORLD[STATE.currentRoom].name;
    turnEl.innerText = STATE.turn;
    const maxEvidence = 20;
    evCountEl.innerText = `${STATE.evidence.size}/${maxEvidence}`;
    
    // Update timer if enabled
    if (STATE.timerEnabled) {
        const timerEl = document.getElementById('timer-display');
        const timerValueEl = document.getElementById('timer-value');
        if (timerEl && timerValueEl) {
            timerEl.classList.remove('hidden');
            const minutes = Math.floor(STATE.timeRemaining);
            const seconds = Math.floor((STATE.timeRemaining - minutes) * 60);
            timerValueEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            if (STATE.timeRemaining < 10) {
                timerValueEl.className = 'text-red-600 animate-pulse';
            } else if (STATE.timeRemaining < 30) {
                timerValueEl.className = 'text-yellow-500';
            }
        }
    }
    
    // Map
    document.querySelectorAll('.map-cell').forEach(el => el.classList.remove('active'));
    const mapId = `map-${STATE.currentRoom}`;
    const activeCell = document.getElementById(mapId);
    if (activeCell) activeCell.classList.add('active');

    // Inventory
    invEl.innerHTML = '';
    if (STATE.inventory.length === 0) {
        invEl.innerHTML = '<li class="italic text-gray-700 opacity-50">Empty...</li>';
    } else {
        STATE.inventory.forEach(itemKey => {
            const li = document.createElement('li');
            li.innerText = `> ${ITEMS[itemKey].name}`;
            li.className = "text-cyan-500 glow-text";
            invEl.appendChild(li);
        });
    }

    // Notes
    notesEl.innerHTML = '';
    if (STATE.notes.length === 0) {
        notesEl.innerHTML = '<div class="italic opacity-30">No data recorded.</div>';
    } else {
        STATE.notes.forEach(note => {
            const div = document.createElement('div');
            div.className = 'text-[9px] mb-1';
            div.innerText = `• ${note}`;
            notesEl.appendChild(div);
        });
    }
    
    updateDocumentation();
}

// Documentation Functions
export function documentCharacter(npcKey) {
    if (STATE.documentation.characters[npcKey]) return;
    
    const npcData = CONVERSATIONS[npcKey];
    if (!npcData) return;
    
    const room = Object.values(WORLD).find(r => r.npc === npcKey);
    const location = room ? room.name : 'Unknown';
    
    STATE.documentation.characters[npcKey] = {
        name: npcKey.charAt(0).toUpperCase() + npcKey.slice(1),
        role: getCharacterRole(npcKey),
        location: location,
        status: getCharacterStatus(npcKey),
        description: getCharacterDescription(npcKey),
        notes: [],
        keyInfo: []
    };
    
    updateDocumentation();
}

function getCharacterRole(npcKey) {
    const roles = {
        'aria': 'AI Mainframe',
        'rook': 'Station Engineer',
        'corinne': 'Research Scientist',
        'zara': 'Medical Officer',
        'thorne': 'Security Chief',
        'voss': 'Station Commander',
        'jax': 'Tech Specialist'
    };
    return roles[npcKey] || 'Unknown';
}

function getCharacterStatus(npcKey) {
    const statuses = {
        'aria': 'Witness/Neutral',
        'rook': 'Suspect (Cleared)',
        'corinne': 'Primary Suspect',
        'zara': 'Witness/Neutral',
        'thorne': 'Suspect',
        'voss': 'Suspect/Authority',
        'jax': 'Suspect'
    };
    return statuses[npcKey] || 'Unknown';
}

function getCharacterDescription(npcKey) {
    const descs = {
        'aria': 'Glitched AI with missing memory fragments. Helpful but cryptic.',
        'rook': 'Station engineer, gruff personality. Has gambling debts but has alibi.',
        'corinne': 'Research scientist, worked on Project Chimera. Motive: Vane stole her research.',
        'zara': 'Medical officer, treated Vane. Professional, concerned about patient care.',
        'thorne': 'Security chief, suspicious behavior. Might be covering something up.',
        'voss': 'Station authority, knows more than she tells. Might be protecting secrets.',
        'jax': 'Tech specialist, rival to Rook. Access to override chips and tools.'
    };
    return descs[npcKey] || 'No description available.';
}

export function documentEvidence(evidenceName, location, type = 'physical') {
    if (STATE.documentation.evidence[evidenceName]) return;
    
    let description = '';
    for (const [itemKey, item] of Object.entries(ITEMS)) {
        if (item.evidence === evidenceName) {
            description = item.desc;
            break;
        }
    }
    
    STATE.documentation.evidence[evidenceName] = {
        name: evidenceName,
        type: type,
        location: location,
        description: description,
        connections: []
    };
    
    updateDocumentation();
}

export function documentScene(roomKey, event) {
    if (!STATE.documentation.scenes[roomKey]) {
        const room = WORLD[roomKey];
        STATE.documentation.scenes[roomKey] = {
            name: room.name,
            description: room.desc,
            items: [],
            npcs: room.npc ? [room.npc] : [],
            keyEvents: []
        };
    }
    
    if (event) {
        STATE.documentation.scenes[roomKey].keyEvents.push(event);
    }
    
    updateDocumentation();
}

export function updateCharacterInfo(npcKey, info) {
    if (!STATE.documentation.characters[npcKey]) return;
    if (!STATE.documentation.characters[npcKey].notes.includes(info)) {
        STATE.documentation.characters[npcKey].notes.push(info);
        updateDocumentation();
    }
}

function updateDocumentation() {
    // Update Characters tab
    docCharsEl.innerHTML = '';
    const chars = Object.values(STATE.documentation.characters);
    if (chars.length === 0) {
        docCharsEl.innerHTML = '<div class="italic opacity-30">No characters documented yet.</div>';
    } else {
        chars.forEach(char => {
            const div = document.createElement('div');
            div.className = 'mb-2 pb-2 border-b border-gray-800';
            div.innerHTML = `
                <div class="font-bold text-amber-400">${char.name}</div>
                <div class="text-[9px] text-gray-500">${char.role} | ${char.location}</div>
                <div class="text-[9px] text-cyan-400">Status: ${char.status}</div>
                <div class="text-[9px] mt-1">${char.description}</div>
                ${char.notes.length > 0 ? '<div class="text-[9px] mt-1 text-gray-500">' + char.notes.join('; ') + '</div>' : ''}
            `;
            docCharsEl.appendChild(div);
        });
    }
    
    // Update Evidence tab
    docEvidenceEl.innerHTML = '';
    const evidence = Object.values(STATE.documentation.evidence);
    if (evidence.length === 0) {
        docEvidenceEl.innerHTML = '<div class="italic opacity-30">No evidence documented yet.</div>';
    } else {
        evidence.forEach(ev => {
            const div = document.createElement('div');
            div.className = 'mb-2 pb-2 border-b border-gray-800';
            const typeColor = ev.type === 'physical' ? 'text-red-400' : ev.type === 'digital' ? 'text-cyan-400' : 'text-yellow-400';
            div.innerHTML = `
                <div class="font-bold ${typeColor}">[${ev.type.toUpperCase()}] ${ev.name}</div>
                <div class="text-[9px] text-gray-500">Found: ${ev.location}</div>
                ${ev.description ? '<div class="text-[9px] mt-1">' + ev.description + '</div>' : ''}
            `;
            docEvidenceEl.appendChild(div);
        });
    }
    
    // Update Scenes tab
    docScenesEl.innerHTML = '';
    const scenes = Object.values(STATE.documentation.scenes);
    if (scenes.length === 0) {
        docScenesEl.innerHTML = '<div class="italic opacity-30">No scenes documented yet.</div>';
    } else {
        scenes.forEach(scene => {
            const div = document.createElement('div');
            div.className = 'mb-2 pb-2 border-b border-gray-800';
            div.innerHTML = `
                <div class="font-bold text-green-400">${scene.name}</div>
                <div class="text-[9px] mt-1">${scene.description}</div>
                ${scene.items.length > 0 ? '<div class="text-[9px] text-cyan-400 mt-1">Items: ' + scene.items.join(', ') + '</div>' : ''}
                ${scene.npcs.length > 0 ? '<div class="text-[9px] text-amber-400 mt-1">NPCs: ' + scene.npcs.join(', ') + '</div>' : ''}
            `;
            docScenesEl.appendChild(div);
        });
    }
}

export function addNote(text) {
    if (!STATE.notes.includes(text)) {
        STATE.notes.push(text);
        updateUI();
        printInstant(`[NOTE ADDED: ${text}]`, 'text-[10px] text-amber-500');
    }
}

export function addEvidence(evName) {
    if (evName && !STATE.evidence.has(evName)) {
        STATE.evidence.add(evName);
        Sound.success();
        printLine(`EVIDENCE LOGGED: [${evName}]`, 'txt-success');
        
        const room = WORLD[STATE.currentRoom];
        documentEvidence(evName, room.name, 'physical');
        
        // Check for evidence connections
        if (EVIDENCE_CONNECTIONS[evName]) {
            const relatedEvidence = EVIDENCE_CONNECTIONS[evName].filter(rel => STATE.evidence.has(rel));
            if (relatedEvidence.length > 0) {
                setTimeout(async () => {
                    await printLine(`EVIDENCE LINK: ${evName} connects to ${relatedEvidence.join(', ')}`, 'txt-sys text-xs opacity-70 italic');
                }, 500);
            }
        }
        
        updateUI();
    }
}

// Output Functions
export async function printLine(text, className = '') {
    return new Promise(resolve => {
        const p = document.createElement('p');
        if (className) p.className = className;
        outputEl.appendChild(p);
        
        if (className.includes('txt-error')) Sound.error();

        isTyping = true;
        let i = 0;
        const speed = 10;
        
        function type() {
            if (i < text.length) {
                p.textContent += text.charAt(i);
                if (i % 3 === 0) Sound.blip();
                i++;
                outputEl.scrollTop = outputEl.scrollHeight;
                setTimeout(type, speed);
            } else {
                isTyping = false;
                resolve();
            }
        }
        type();
    });
}

export function printInstant(text, className = '') {
    const p = document.createElement('p');
    if (className) p.className = className;
    p.textContent = text;
    outputEl.appendChild(p);
    outputEl.scrollTop = outputEl.scrollHeight;
}

export function printClickableOption(text, callback) {
    const p = document.createElement('p');
    p.className = 'txt-choice ml-4 hover:text-green-400 cursor-pointer transition-colors';
    p.innerText = text;
    p.onclick = callback;
    outputEl.appendChild(p);
    outputEl.scrollTop = outputEl.scrollHeight;
}

export function showGameOver(rank, msg, colorClass) {
    const endRating = document.getElementById('end-rating');
    const endMessage = document.getElementById('end-message');
    const gameOverPage = document.getElementById('game-over-page');
    
    endRating.innerText = `RANK: ${rank}`;
    endRating.className = `text-6xl md:text-9xl font-bold mb-8 glow-text ${colorClass}`;
    endMessage.innerText = msg;
    gameOverPage.classList.remove('hidden');
    void gameOverPage.offsetWidth;
    gameOverPage.classList.add('visible');
    Sound.stopAmbient();
}

