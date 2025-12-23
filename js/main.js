// Main initialization and event handlers
import { DETECTIVE_NAME } from './config.js';
import { Sound } from './sound.js';
import * as UI from './ui.js';
import * as Game from './game.js';
import * as Parser from './parser.js';

// Initialize STATE
const STATE = {
    mode: 'EXPLORE',
    currentRoom: 'docking_bay',
    turn: 0,
    inventory: [],
    evidence: new Set(),
    notes: [],
    conversationTarget: null,
    conversationHistory: {},
    timeRemaining: 60,
    timerEnabled: false,
    evidenceConnections: {},
    documentation: {
        characters: {},
        evidence: {},
        scenes: {},
        timeline: []
    },
    flags: {
        talkedToAria: false,
        inspectedBody: false,
        foundVent: false,
        foundGamblingSlate: false,
        unlockedAria: false,
        chipInstalled: false,
        discussedRookAlibi: false,
        talkedToZara: false,
        talkedToThorne: false,
        talkedToVoss: false,
        talkedToJax: false,
        foundMedicalRecords: false,
        foundSecurityFootage: false,
        foundPoisonTraces: false,
        foundJaxAccessLog: false,
        foundCommandAuth: false,
        foundBlackmailEvidence: false,
        foundSmugglingEvidence: false,
        foundChipSource: false,
        foundTimeDiscrepancy: false,
        foundConspiracyEvidence: false
    }
};

// DOM Elements
const outputEl = document.getElementById('console-output');
const inputEl = document.getElementById('command-input');
const formEl = document.getElementById('command-form');
const locEl = document.getElementById('status-loc');
const turnEl = document.getElementById('status-turn');
const invEl = document.getElementById('inventory-list');
const notesEl = document.getElementById('doc-notes');
const evCountEl = document.getElementById('evidence-count');
const landingPage = document.getElementById('landing-page');
const gameOverPage = document.getElementById('game-over-page');
const restartBtn = document.getElementById('restart-btn');
const bootText = document.getElementById('boot-text');
const startBtn = document.getElementById('start-btn');
const promptSymbol = document.getElementById('prompt-symbol');
const inputHint = document.getElementById('input-hint');
const docCharsEl = document.getElementById('doc-characters');
const docEvidenceEl = document.getElementById('doc-evidence');
const docScenesEl = document.getElementById('doc-scenes');
const docTabs = document.querySelectorAll('.doc-tab');

// Initialize modules
UI.initUI(STATE, {
    outputEl, locEl, turnEl, invEl, notesEl, evCountEl,
    docCharsEl, docEvidenceEl, docScenesEl
});

Game.initGame(STATE, { promptSymbol, inputHint });
Parser.initParser(STATE, { promptSymbol, inputHint });

// Tab switching
docTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;
        docTabs.forEach(t => {
            t.classList.remove('active', 'bg-gray-800', 'text-amber-500');
            t.classList.add('text-gray-600');
        });
        tab.classList.add('active', 'bg-gray-800', 'text-amber-500');
        tab.classList.remove('text-gray-600');
        
        document.querySelectorAll('.doc-content').forEach(content => {
            content.classList.add('hidden');
        });
        document.getElementById(`doc-${targetTab}`).classList.remove('hidden');
    });
});

// Boot Sequence
const bootSequence = [
    "Initializing Kernel...",
    "Loading Neural Link...",
    "Connecting to Station Icarus Relay...",
    `Authentication: ${DETECTIVE_NAME.toUpperCase()}`,
    "Secure Connection Established.",
    "",
    "> INCOMING TRANSMISSION <",
    `${DETECTIVE_NAME}, Dr. Silas Vane is dead.`,
    "He was working on illegal AI modifications in the Void Sector.",
    "You have 1 hour before the station's orbit decays.",
    "Find the killer. Secure the data.",
    "Trust no one."
];

async function playBootSequence() {
    for (let line of bootSequence) {
        const p = document.createElement('p');
        p.textContent = line;
        bootText.appendChild(p);
        Sound.blip();
        bootText.scrollTop = bootText.scrollHeight;
        await new Promise(r => setTimeout(r, 600));
    }
    startBtn.classList.remove('opacity-0');
}

// Event Listeners
startBtn.addEventListener('click', () => {
    Sound.success();
    Sound.setRoomAmbience(STATE.currentRoom);
    landingPage.classList.add('hidden');
    Game.look();
});

restartBtn.addEventListener('click', () => {
    Sound.success();
    window.location.reload();
});

formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    if (UI.isTyping) return;
    const val = inputEl.value;
    inputEl.value = '';
    Parser.parseCommand(val);
});

// Initialize
UI.updateUI();
Sound.init();
playBootSequence();

