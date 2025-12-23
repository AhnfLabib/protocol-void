// Command parser and accusation handler
import { WORLD, ITEMS } from './world.js';
import { CONVERSATIONS } from './conversations.js';
import { Sound } from './sound.js';
import { DETECTIVE_NAME, SUSPECT_KEYS, EVIDENCE_KEYS } from './config.js';
import * as UI from './ui.js';
import * as Game from './game.js';

let STATE = null;
let promptSymbol = null;
let inputHint = null;

export function initParser(state, domElements) {
    STATE = state;
    promptSymbol = domElements.promptSymbol;
    inputHint = domElements.inputHint;
}

function levenshteinDistance(str1, str2) {
    const matrix = [];
    for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
    }
    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    return matrix[str2.length][str1.length];
}

function decodeSuspect(input) {
    const s = input.toLowerCase();
    if (s.includes('corinne')) return 'corinne';
    if (s.includes('jax')) return 'jax';
    if (s.includes('thorne')) return 'thorne';
    if (s.includes('voss')) return 'voss';
    if (s.includes('rook')) return 'rook';
    if (s.includes('aria')) return 'aria';
    for (const [key, value] of Object.entries(SUSPECT_KEYS)) {
        if (s.includes(key)) return value;
    }
    return null;
}

function hasEvidence(key) {
    const evidenceName = EVIDENCE_KEYS[key] || key;
    return STATE.evidence.has(evidenceName);
}

export async function handleAccusation(input) {
    STATE.mode = 'END';

    UI.printInstant("------------------------------------------------", 'txt-sys');
    await UI.printLine("TRANSMITTING FINAL VERDICT...", 'txt-sys');

    const hasConspiracyEvidence = hasEvidence('ev8') && 
                                hasEvidence('ev7') &&
                                hasEvidence('ev5');

    const suspect = decodeSuspect(input);
    
    if (suspect === 'corinne') {
        const hasConfession = hasEvidence('ev1');
        const evidenceCount = STATE.evidence.size;
        
        if (hasConfession && evidenceCount >= 5) {
            Sound.success();
            await UI.printLine("VERDICT: ACCEPTED.", 'txt-success text-xl font-bold');
            await UI.printLine("Dr. Corinne was detained. Your comprehensive evidence proved she murdered Vane to protect her research and prevent him from selling A.R.I.A. to the military. Justice served.", 'text-white mt-4');
            await UI.printLine("MISSION RATING: S", 'txt-success text-2xl');
            setTimeout(() => UI.showGameOver("S", `EXCELLENT WORK, ${DETECTIVE_NAME.toUpperCase()}. THE STATION IS SECURE.`, "text-green-500"), 4000);
        } else if (hasConfession || evidenceCount >= 3) {
            Sound.success();
            await UI.printLine("VERDICT: ACCEPTED.", 'txt-success text-xl font-bold');
            await UI.printLine("Dr. Corinne was detained. Your evidence proved she murdered Vane, though some details of the conspiracy remain unclear.", 'text-white mt-4');
            await UI.printLine("MISSION RATING: A", 'txt-success');
            setTimeout(() => UI.showGameOver("A", `GOOD WORK, ${DETECTIVE_NAME.toUpperCase()}. CASE SOLVED.`, "text-green-400"), 4000);
        } else {
            await UI.printLine("VERDICT: DISPUTED.", 'txt-warn text-xl font-bold');
            await UI.printLine("Corinne was arrested, but her lawyers tore your case apart due to lack of concrete evidence. She walked free a month later.", 'text-white mt-4');
            await UI.printLine("MISSION RATING: C", 'txt-warn');
            setTimeout(() => UI.showGameOver("C", "CASE COMPROMISED. SUSPECT RELEASED.", "text-yellow-500"), 4000);
        }
    } else if (suspect === 'jax') {
        const hasJaxEvidence = hasEvidence('ev2') && 
                             hasEvidence('ev3') &&
                             hasEvidence('ev4');
        
        if (hasJaxEvidence && STATE.evidence.size >= 4) {
            Sound.success();
            await UI.printLine("VERDICT: ACCEPTED.", 'txt-success text-xl font-bold');
            await UI.printLine("Jax was arrested. Evidence shows he was in the Server Room just before the murder, had motive (blackmail), and access to the override chip. However, further investigation reveals he may have been working with others.", 'text-white mt-4');
            await UI.printLine("MISSION RATING: A", 'txt-success');
            setTimeout(() => UI.showGameOver("A", `PARTIAL SUCCESS, ${DETECTIVE_NAME.toUpperCase()}. SUSPECT DETAINED.`, "text-green-400"), 4000);
        } else if (hasJaxEvidence) {
            await UI.printLine("VERDICT: DISPUTED.", 'txt-warn text-xl font-bold');
            await UI.printLine("Jax was arrested, but the case was weak. He claimed he was framed. The truth remains unclear.", 'text-white mt-4');
            await UI.printLine("MISSION RATING: C", 'txt-warn');
            setTimeout(() => UI.showGameOver("C", "CASE WEAK. SUSPECT DISPUTES CHARGES.", "text-yellow-500"), 4000);
        } else {
            Sound.error();
            await UI.printLine("VERDICT: ERROR.", 'txt-error text-xl font-bold');
            await UI.printLine("Insufficient evidence against Jax. He was released, and the real killer remains free.", 'text-white mt-4');
            await UI.printLine("MISSION RATING: D", 'txt-error');
            setTimeout(() => UI.showGameOver("D", "INSUFFICIENT EVIDENCE. CASE FAILED.", "text-red-400"), 4000);
        }
    } else if (suspect === 'thorne') {
        const hasThorneEvidence = hasEvidence('ev5') &&
                                hasEvidence('ev6');
        
        if (hasThorneEvidence && STATE.evidence.size >= 4) {
            await UI.printLine("VERDICT: PARTIAL.", 'txt-warn text-xl font-bold');
            await UI.printLine("Thorne was arrested for smuggling, but evidence suggests he may have been involved in the murder as part of a cover-up. The full truth remains hidden.", 'text-white mt-4');
            await UI.printLine("MISSION RATING: B", 'txt-warn');
            setTimeout(() => UI.showGameOver("B", "PARTIAL TRUTH REVEALED. CONSPIRACY SUSPECTED.", "text-yellow-400"), 4000);
        } else {
            Sound.error();
            await UI.printLine("VERDICT: ERROR.", 'txt-error text-xl font-bold');
            await UI.printLine("Thorne was innocent of murder. You arrested the wrong person while the real killer escaped.", 'text-white mt-4');
            await UI.printLine("MISSION RATING: F", 'txt-error');
            setTimeout(() => UI.showGameOver("F", "CRITICAL JUDGEMENT ERROR. INNOCENT CONVICTED.", "text-red-500"), 4000);
        }
    } else if (suspect === 'voss') {
        if (hasConspiracyEvidence && STATE.evidence.size >= 6) {
            Sound.success();
            await UI.printLine("VERDICT: CONSPIRACY UNCOVERED.", 'txt-success text-xl font-bold');
            await UI.printLine("Voss was arrested along with Thorne. You uncovered the full conspiracy - they were covering up Project Chimera for corporate interests. Vane's murder was part of the cover-up. The truth is finally exposed.", 'text-white mt-4');
            await UI.printLine("MISSION RATING: S", 'txt-success text-2xl');
            setTimeout(() => UI.showGameOver("S", `CONSPIRACY UNCOVERED, ${DETECTIVE_NAME.toUpperCase()}. JUSTICE SERVED.`, "text-green-500"), 4000);
        } else if (STATE.evidence.has("Command Authorization")) {
            await UI.printLine("VERDICT: DISPUTED.", 'txt-warn text-xl font-bold');
            await UI.printLine("Voss was questioned but released. Evidence of conspiracy was insufficient. The cover-up continues.", 'text-white mt-4');
            await UI.printLine("MISSION RATING: C", 'txt-warn');
            setTimeout(() => UI.showGameOver("C", "CONSPIRACY REMAINS HIDDEN. CASE INCOMPLETE.", "text-yellow-500"), 4000);
        } else {
            Sound.error();
            await UI.printLine("VERDICT: ERROR.", 'txt-error text-xl font-bold');
            await UI.printLine("Insufficient evidence. Voss used her authority to dismiss the charges. The conspiracy remains hidden.", 'text-white mt-4');
            await UI.printLine("MISSION RATING: D", 'txt-error');
            setTimeout(() => UI.showGameOver("D", "INSUFFICIENT EVIDENCE. AUTHORITY PROTECTED.", "text-red-400"), 4000);
        }
    } else if (suspect === 'rook') {
        Sound.error();
        await UI.printLine("VERDICT: ERROR.", 'txt-error text-xl font-bold');
        await UI.printLine("Rook was innocent of murder. You sent a man to prison for gambling debts while the real killer escaped.", 'text-white mt-4');
        await UI.printLine("MISSION RATING: F", 'txt-error');
        setTimeout(() => UI.showGameOver("F", "CRITICAL JUDGEMENT ERROR. INNOCENT CONVICTED.", "text-red-500"), 4000);
    } else if (suspect === 'aria') {
        Sound.error();
        triggerShake();
        await UI.printLine("CRITICAL FAILURE.", 'txt-error text-xl font-bold');
        await UI.printLine("Accusing the AI triggered a failsafe. Station Icarus vented all atmosphere. There were no survivors.", 'text-red-500 mt-4');
        await UI.printLine("MISSION RATING: TERMINATED", 'txt-error');
        setTimeout(() => UI.showGameOver("TERMINATED", "FATAL SYSTEM ERROR. CREW LOST.", "text-red-600"), 4000);
    } else {
        await UI.printLine("INVALID TARGET. CASE COLD.", 'txt-error');
        setTimeout(() => UI.showGameOver("FAIL", "SUBMISSION ERROR. SUSPECT UNKNOWN.", "text-gray-500"), 4000);
    }
}

function triggerShake() {
    const main = document.querySelector('main');
    main.classList.remove('shake');
    void main.offsetWidth;
    main.classList.add('shake');
}

export async function parseCommand(raw) {
    const inputRaw = raw.trim().toLowerCase();
    if (!inputRaw) return;
    
    Sound.init();

    if (STATE.mode === 'CONVERSATION') {
        UI.printInstant(`> ${raw}`, 'text-gray-600');
        await Game.handleConversationInput(inputRaw);
        return;
    }

    if (STATE.mode === 'ACCUSE') {
        UI.printInstant(`> ${raw}`, 'text-gray-600');
        await handleAccusation(inputRaw);
        return;
    }

    UI.printInstant(`> ${raw}`, 'txt-sys opacity-50');

    const tokens = inputRaw.split(' ').filter(t => t.trim() !== '');
    const verb = tokens[0];
    
    const fillers = ['to', 'the', 'at', 'with', 'from', 'a', 'an', 'in', 'on'];
    const noun = tokens.slice(1).filter(word => !fillers.includes(word)).join(' ');

    if (verb === 'help') {
        await UI.printLine("AVAILABLE COMMANDS:", 'txt-nav mb-2');
        const helps = [
            { cmd: "LOOK / L", desc: "Examine current location." },
            { cmd: "MOVE [DIR]", desc: "Travel (N/S/E/W/NE/NW/SE/SW or room name)." },
            { cmd: "INSPECT [OBJ]", desc: "Examine an item or environment detail." },
            { cmd: "TAKE [ITEM]", desc: "Pick up an item." },
            { cmd: "TALK [NAME]", desc: "Converse with a character." },
            { cmd: "INV", desc: "List carried items." },
            { cmd: "TIMER", desc: "Toggle time pressure (optional)." },
            { cmd: "ACCUSE", desc: "Identify the killer (Ends Game)." }
        ];
        for (let h of helps) {
            UI.printInstant(` ${h.cmd.padEnd(12)} : ${h.desc}`, 'text-gray-400 text-xs md:text-sm ml-2');
        }
        return;
    }
    
    if (verb === 'timer' || verb === 'time') {
        STATE.timerEnabled = !STATE.timerEnabled;
        const timerEl = document.getElementById('timer-display');
        if (STATE.timerEnabled) {
            STATE.timeRemaining = 60;
            if (timerEl) timerEl.classList.remove('hidden');
            await UI.printLine("TIMER ENABLED: 60 minutes remaining.", 'txt-warn');
            if (!window.timerInterval) {
                window.timerInterval = setInterval(() => {
                    if (STATE.timerEnabled && STATE.mode !== 'END') {
                        STATE.timeRemaining -= 1/60;
                        if (STATE.timeRemaining <= 0) {
                            STATE.timeRemaining = 0;
                            STATE.timerEnabled = false;
                            clearInterval(window.timerInterval);
                            window.timerInterval = null;
                            UI.printLine("TIME EXPIRED. Station orbit decayed. Mission failed.", 'txt-error text-xl');
                            setTimeout(() => UI.showGameOver("F", "TIME EXPIRED. STATION LOST.", "text-red-600"), 2000);
                        }
                        UI.updateUI();
                    }
                }, 1000);
            }
        } else {
            if (timerEl) timerEl.classList.add('hidden');
            if (window.timerInterval) {
                clearInterval(window.timerInterval);
                window.timerInterval = null;
            }
            await UI.printLine("TIMER DISABLED.", 'txt-sys');
        }
        return;
    }

    if (verb === 'look' || verb === 'l') {
        await Game.look();
        return;
    }

    if (verb === 'move' || verb === 'go' || verb === 'walk') {
        const room = WORLD[STATE.currentRoom];
        
        const dirMap = {
            'n': 'north', 's': 'south', 'e': 'east', 'w': 'west',
            'ne': 'northeast', 'nw': 'northwest', 'se': 'southeast', 'sw': 'southwest',
            'north': 'north', 'south': 'south', 'east': 'east', 'west': 'west',
            'northeast': 'northeast', 'northwest': 'northwest',
            'southeast': 'southeast', 'southwest': 'southwest'
        };
        
        const normalizedDir = dirMap[noun.toLowerCase()] || noun.toLowerCase();
        let newRoomKey = room.exits[normalizedDir] || room.exits[noun] || room.exits[noun.charAt(0)];
        
        if (!newRoomKey) {
            for (const [dir, targetKey] of Object.entries(room.exits)) {
                const targetRoom = WORLD[targetKey];
                if (targetKey.replace('_', ' ').includes(noun) || targetRoom.name.toLowerCase().includes(noun)) {
                    newRoomKey = targetKey;
                    break;
                }
            }
        }

        if (newRoomKey) {
            await Game.moveToRoom(newRoomKey);
        } else {
            await UI.printLine("PATH BLOCKED / INVALID.", 'txt-error');
            const availableExits = Object.keys(room.exits).map(dir => {
                const targetRoom = WORLD[room.exits[dir]];
                return `${dir.toUpperCase()} (${targetRoom.name})`;
            }).join(', ');
            if (availableExits) {
                await UI.printLine(`AVAILABLE PATHS: ${availableExits}`, 'txt-sys text-xs');
            }
        }
        return;
    }

    if (verb === 'take' || verb === 'grab' || verb === 'get') {
        const room = WORLD[STATE.currentRoom];
        const itemKey = room.items.find(k => ITEMS[k].name.toLowerCase().includes(noun) || k.includes(noun));
        if (itemKey) {
            room.items = room.items.filter(k => k !== itemKey);
            STATE.inventory.push(itemKey);
            Sound.success();
            await UI.printLine(`ITEM ACQUIRED: ${ITEMS[itemKey].name}`, 'txt-success');
            UI.updateUI();
        } else {
            await UI.printLine("ITEM NOT LOCATED.", 'txt-error');
            if (room.items.length > 0) {
                const itemNames = room.items.map(k => ITEMS[k].name).join(', ');
                await UI.printLine(`VISIBLE ITEMS: ${itemNames}`, 'txt-sys text-xs');
            } else {
                await UI.printLine("HINT: Try 'INSPECT' on objects in the room to find hidden items.", 'txt-sys text-xs opacity-70');
            }
        }
        return;
    }

    if (verb === 'inspect' || verb === 'check' || verb === 'x' || verb === 'examine') {
        if (!noun) {
            await UI.printLine("INSPECT WHAT?", 'txt-error');
            const room = WORLD[STATE.currentRoom];
            const inspectable = ['room', 'vent', 'locker', 'toolkit', 'body', 'grate', 'workbench', 'table'];
            const roomItems = room.items.map(k => ITEMS[k].name.toLowerCase());
            const suggestions = [...inspectable, ...roomItems].filter(item => {
                const roomData = WORLD[STATE.currentRoom];
                if (item === 'vent' && roomData.name === 'Cryo Bay') return true;
                if (item === 'toolkit' && roomData.name === 'Engineering') return true;
                if (item === 'locker' && roomData.name === 'Engineering') return true;
                if (item === 'body' && roomData.name === 'Server Room') return true;
                return roomItems.includes(item);
            });
            if (suggestions.length > 0) {
                await UI.printLine(`SUGGESTIONS: ${suggestions.slice(0, 5).join(', ')}`, 'txt-sys text-xs');
            }
            return;
        }
        await Game.inspect(noun);
        return;
    }

    if (verb === 'talk' || verb === 'speak') {
        const room = WORLD[STATE.currentRoom];
        if (room.npc && (room.npc === noun || room.npc.includes(noun))) {
            await Game.startConversation(room.npc);
        } else if (noun.includes('jax') && STATE.currentRoom === 'engineering' && CONVERSATIONS['jax']) {
            await Game.startConversation('jax');
        } else {
            let foundNPC = null;
            for (const [roomKey, roomData] of Object.entries(WORLD)) {
                if (roomData.npc && (roomData.npc === noun || roomData.npc.includes(noun))) {
                    foundNPC = roomData.npc;
                    break;
                }
            }
            if (!foundNPC && CONVERSATIONS[noun]) {
                foundNPC = noun;
            }
            const specialNPCs = ['aria', 'rook', 'corinne', 'zara', 'thorne', 'voss', 'jax'];
            if (!foundNPC && specialNPCs.some(npc => npc.includes(noun) || noun.includes(npc))) {
                foundNPC = specialNPCs.find(npc => npc.includes(noun) || noun.includes(npc));
            }
            
            if (foundNPC && CONVERSATIONS[foundNPC]) {
                await Game.startConversation(foundNPC);
            } else {
                await UI.printLine("TARGET NOT PRESENT.", 'txt-error');
            }
        }
        return;
    }

    if (verb === 'inv') {
        UI.updateUI();
        return;
    }

    if (verb === 'accuse') {
        STATE.mode = 'ACCUSE';
        Sound.error();
        await UI.printLine("!!! FINAL PROTOCOL INITIATED !!!", 'txt-warn text-xl');
        await UI.printLine("You are about to file your final report. This cannot be undone.", 'txt-sys');
        await UI.printLine("Identify the killer: [CORINNE] / [JAX] / [THORNE] / [VOSS] / [ROOK] / [ARIA]", 'txt-success glow-text');
        await UI.printLine("Evidence collected: " + STATE.evidence.size + " pieces", 'txt-sys');
        return;
    }

    const validVerbs = ['look', 'l', 'move', 'go', 'walk', 'take', 'grab', 'get', 'inspect', 'check', 'x', 'examine', 'talk', 'speak', 'inv', 'inventory', 'accuse', 'help'];
    const similarVerb = validVerbs.find(v => {
        const distance = levenshteinDistance(verb, v);
        return distance <= 2 && distance < verb.length;
    });
    
    if (similarVerb) {
        await UI.printLine(`UNKNOWN COMMAND. Did you mean: "${similarVerb.toUpperCase()}"?`, 'txt-error');
    } else {
        await UI.printLine("UNKNOWN COMMAND. Type 'HELP' for available commands.", 'txt-error');
    }
}

