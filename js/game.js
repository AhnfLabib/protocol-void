// Core game logic: look, inspect, conversations, movement
import { WORLD, ITEMS } from './world.js';
import { CONVERSATIONS } from './conversations.js';
import { Sound } from './sound.js';
import * as UI from './ui.js';

let STATE = null;
let promptSymbol = null;
let inputHint = null;

export function initGame(state, domElements) {
    STATE = state;
    promptSymbol = domElements.promptSymbol;
    inputHint = domElements.inputHint;
}

export async function look() {
    const room = WORLD[STATE.currentRoom];
    await UI.printLine(`LOCATION: ${room.name}`, 'text-white font-bold underline mt-4');
    await UI.printLine(room.desc, 'text-gray-300');
    
    UI.documentScene(STATE.currentRoom);
    
    if (room.items.length > 0) {
        const names = room.items.map(k => ITEMS[k].name).join(', ');
        await UI.printLine(`VISIBLE: ${names}`, 'txt-item');
    }
    
    const inspectableHints = [];
    if (STATE.currentRoom === 'cryo_bay' && !STATE.flags.foundVent) {
        inspectableHints.push('VENT (loose grate)');
    }
    if (STATE.currentRoom === 'engineering') {
        if (!STATE.inventory.includes('override_chip') && !room.items.includes('override_chip')) {
            inspectableHints.push('TOOLKIT (workbench)');
        }
        if (!STATE.flags.foundGamblingSlate) {
            inspectableHints.push('LOCKER (Rook\'s)');
        }
    }
    if (STATE.currentRoom === 'server_room' && !STATE.flags.inspectedBody) {
        inspectableHints.push('BODY (Vane\'s corpse)');
    }
    if (inspectableHints.length > 0) {
        await UI.printLine(`INSPECTABLE: ${inspectableHints.join(', ')}`, 'txt-sys text-xs opacity-70 italic');
    }
    
    if (room.npc) {
        await UI.printLine(`DETECTED: ${room.npc.toUpperCase()}`, 'txt-warn');
        UI.documentCharacter(room.npc);
    }
}

export async function inspect(target) {
    const room = WORLD[STATE.currentRoom];
    let actualTarget = target;
    if (['grate', 'ventilation'].includes(target)) actualTarget = 'vent';
    if (['workbench', 'tools', 'table'].includes(target)) actualTarget = 'toolkit';
    if (['lockers', 'cabinet'].includes(target)) actualTarget = 'locker';
    if (['corpse', 'vane', 'man', 'victim'].includes(target)) actualTarget = 'body';

    if (actualTarget === 'room' || actualTarget === 'area' || actualTarget === 'vent' || actualTarget === 'locker' || actualTarget === 'toolkit' || actualTarget === 'body') {
        if (STATE.currentRoom === 'cryo_bay' && actualTarget === 'vent') {
            if (!STATE.flags.foundVent) {
                STATE.flags.foundVent = true;
                room.items.push('lab_coat');
                await UI.printLine("You pry open the loose grate. Something white is stuffed inside.", 'txt-sys');
                await UI.printLine("REVEALED: Torn Lab Coat.", 'txt-item');
                UI.addNote("Found a bloody lab coat hidden in Cryo Bay vents.");
            } else if (room.items.includes('lab_coat')) {
                await UI.printLine("The vent is open. The lab coat is still there.", 'txt-sys');
            } else {
                await UI.printLine("The vent is empty, save for dust.", 'txt-sys');
            }
            return;
        }
        
        if (STATE.currentRoom === 'engineering' && actualTarget === 'toolkit') {
            if (!STATE.flags.chipInstalled) {
                if (!STATE.inventory.includes('override_chip') && !room.items.includes('override_chip')) {
                    room.items.push('override_chip');
                    await UI.printLine("You rummage through the toolkit. It looks like it was hastily hidden under the bench.", 'txt-sys');
                    await UI.printLine("REVEALED: AI Override Chip.", 'txt-item');
                } else if (room.items.includes('override_chip')) {
                    await UI.printLine("Rook's toolkit is open. The chip is visible.", 'txt-sys');
                } else {
                    await UI.printLine("Just some rusty wrenches and fusion tape.", 'txt-sys');
                }
            } else {
                await UI.printLine("Just some rusty wrenches and fusion tape.", 'txt-sys');
            }
            return;
        }
        
        if (STATE.currentRoom === 'engineering' && actualTarget === 'locker') {
            if (!STATE.flags.foundGamblingSlate) {
                STATE.flags.foundGamblingSlate = true;
                room.items.push('gambling_slate');
                await UI.printLine("You force open Rook's locker. A digital slate falls out.", 'txt-sys');
                await UI.printLine("REVEALED: Digital Slate.", 'txt-item');
            } else if (room.items.includes('gambling_slate')) {
                await UI.printLine("The locker is open. The slate is on the floor.", 'txt-sys');
            } else {
                await UI.printLine("Rook's locker contains dirty uniforms and empty ration packs.", 'txt-sys');
            }
            return;
        }
        
        if (actualTarget === 'body' && STATE.currentRoom === 'server_room') {
            if (!STATE.flags.inspectedBody) {
                STATE.flags.inspectedBody = true;
                await UI.printLine("Dr. Vane died from blunt force trauma. He is clutching a drive.", 'txt-warn');
                UI.addNote("Vane died from blunt force trauma.");
            } else {
                await UI.printLine("You've examined the body already. Vane is gone.", 'txt-sys');
            }
            return;
        }
    }

    let itemKey = STATE.inventory.find(k => ITEMS[k].name.toLowerCase().includes(actualTarget) || k.includes(actualTarget));
    if (!itemKey) itemKey = room.items.find(k => ITEMS[k].name.toLowerCase().includes(actualTarget) || k.includes(actualTarget));

    if (itemKey) {
        const item = ITEMS[itemKey];
        await UI.printLine(`ANALYZING: ${item.name}`, 'txt-sys');
        await UI.printLine(item.desc, 'txt-item');
        
        if (!STATE.documentation.scenes[STATE.currentRoom]) {
            UI.documentScene(STATE.currentRoom);
        }
        if (!STATE.documentation.scenes[STATE.currentRoom].items.includes(item.name)) {
            STATE.documentation.scenes[STATE.currentRoom].items.push(item.name);
        }
        
        if (itemKey === 'encrypted_drive') {
            if (STATE.flags.talkedToAria) {
                await UI.printLine("SYSTEM: Decryption Key verified (Source: A.R.I.A). Accessing...", 'txt-success');
                await UI.printLine("DATA RECOVERED: Access Logs show Rook's ID card was used to enter the Server Room at 02:00, but biometric weight sensors suggest a user much lighter than Rook.", 'txt-item');
                UI.addEvidence("Access Logs");
                UI.documentEvidence("Access Logs", WORLD[STATE.currentRoom].name, 'digital');
                UI.addNote("Drive decrypted: Rook's card used, but user was lighter than him.");
            } else {
                await UI.printLine("ERROR: Decryption Key required. Consult Station AI.", 'txt-error');
                await UI.printLine("HINT: Talk to A.R.I.A. in the Main Hall to get the decryption key.", 'txt-sys');
            }
        } else if (item.evidence) {
            UI.addEvidence(item.evidence);
            UI.documentEvidence(item.evidence, WORLD[STATE.currentRoom].name, 
                itemKey.includes('log') || itemKey.includes('drive') || itemKey.includes('datapad') || itemKey.includes('footage') || itemKey.includes('manifest') || itemKey.includes('authorization') || itemKey.includes('evidence') || itemKey.includes('report') ? 'digital' : 'physical');
        }
    } else {
        await UI.printLine("TARGET NOT FOUND.", 'txt-error');
        const allItems = [...room.items, ...STATE.inventory].map(k => ITEMS[k].name.toLowerCase());
        const inspectable = ['room', 'vent', 'locker', 'toolkit', 'body'];
        const suggestions = [...allItems, ...inspectable].filter(item => 
            item.includes(actualTarget) || actualTarget.includes(item) || 
            item.split(' ').some(word => word.startsWith(actualTarget)) ||
            actualTarget.split(' ').some(word => item.includes(word))
        ).slice(0, 3);
        if (suggestions.length > 0) {
            await UI.printLine(`DID YOU MEAN: ${suggestions.join(', ')}?`, 'txt-sys text-xs');
        }
    }
}

export async function startConversation(npcKey) {
    STATE.mode = 'CONVERSATION';
    STATE.conversationTarget = npcKey;

    UI.documentCharacter(npcKey);
    UI.documentScene(STATE.currentRoom, `Talked to ${npcKey}`);

    if (npcKey === 'aria') {
        if (!STATE.flags.talkedToAria) {
            STATE.flags.talkedToAria = true;
            UI.addNote("Established link with A.R.I.A. Shared protocols exchanged.");
        }
    } else if (npcKey === 'zara') {
        if (!STATE.flags.talkedToZara) STATE.flags.talkedToZara = true;
    } else if (npcKey === 'thorne') {
        if (!STATE.flags.talkedToThorne) STATE.flags.talkedToThorne = true;
    } else if (npcKey === 'voss') {
        if (!STATE.flags.talkedToVoss) STATE.flags.talkedToVoss = true;
    } else if (npcKey === 'jax') {
        if (!STATE.flags.talkedToJax) STATE.flags.talkedToJax = true;
    }
    
    inputHint.innerText = "Type the number of your choice or Click an option. Type '0' to exit.";
    promptSymbol.className = "text-amber-500 font-bold text-lg";
    
    const data = CONVERSATIONS[npcKey];
    UI.printInstant("------------------------------------------------", 'txt-sys');
    await UI.printLine(`COMM LINK ESTABLISHED: ${npcKey.toUpperCase()}`, 'txt-warn');
    await UI.printLine(data.start, 'text-white italic mb-2');
    
    showConversationOptions();
}

export async function showConversationOptions() {
    if (!STATE.conversationTarget) return;
    const data = CONVERSATIONS[STATE.conversationTarget];
    if (!data) return;

    UI.printInstant("SELECT RESPONSE:", 'txt-sys');
    
    let optionIndex = 1;
    const validOptions = [];

    if (!STATE.conversationHistory[STATE.conversationTarget]) {
        STATE.conversationHistory[STATE.conversationTarget] = new Set();
    }

    data.topics.forEach(topic => {
        let show = true;
        if (topic.reqEvidence && !STATE.evidence.has(topic.reqEvidence)) show = false;
        if (topic.reqItem && !STATE.inventory.includes(topic.reqItem)) show = false;
        if (topic.reqNote) {
            const hasNote = STATE.notes.some(n => n.includes(topic.reqNote) || n === topic.reqNote);
            if (!hasNote) show = false;
        }
        
        const alreadyDiscussed = STATE.conversationHistory[STATE.conversationTarget].has(topic.id);
        
        if (show) {
            const currentIdx = optionIndex;
            const displayText = alreadyDiscussed ? `[${currentIdx}] ${topic.text} [DISCUSSED]` : `[${currentIdx}] ${topic.text}`;
            UI.printClickableOption(displayText, () => {
                if (UI.isTyping) return;
                UI.printInstant(`> ${currentIdx}`, 'text-gray-600');
                handleConversationInput(currentIdx.toString());
            });
            
            topic._index = optionIndex;
            validOptions.push(topic);
            optionIndex++;
        }
    });
    
    UI.printClickableOption(`[0] End Conversation`, () => {
        if (UI.isTyping) return;
        UI.printInstant(`> 0`, 'text-gray-600');
        handleConversationInput('0');
    });
    
    STATE.currentOptions = validOptions;
}

export async function handleConversationInput(input) {
    const choice = parseInt(input);
    
    if (isNaN(choice)) {
        await UI.printLine("INVALID SELECTION.", 'txt-error');
        return;
    }

    if (choice === 0) {
        STATE.mode = 'EXPLORE';
        STATE.conversationTarget = null;
        promptSymbol.className = "text-green-500 font-bold text-lg";
        inputHint.innerText = "Try: 'look', 'move [dir]', 'talk [name]', 'inspect [thing]'";
        await UI.printLine("LINK TERMINATED.", 'txt-sys');
        UI.printInstant("------------------------------------------------", 'txt-sys');
        return;
    }

    const selectedTopic = STATE.currentOptions.find(t => t._index === choice);
    
    if (selectedTopic) {
        if (STATE.conversationTarget && selectedTopic.id) {
            if (!STATE.conversationHistory[STATE.conversationTarget]) {
                STATE.conversationHistory[STATE.conversationTarget] = new Set();
            }
            STATE.conversationHistory[STATE.conversationTarget].add(selectedTopic.id);
        }
        
        UI.printInstant(`You: "${selectedTopic.text}"`, 'text-gray-500 mt-2');
        
        let response = selectedTopic.response;
        const alreadyDiscussed = STATE.conversationHistory[STATE.conversationTarget]?.has(selectedTopic.id);
        if (alreadyDiscussed && selectedTopic.repeatResponse) {
            response = selectedTopic.repeatResponse;
        }
        
        await UI.printLine(`> ${response}`, 'text-amber-300 mb-2');
        
        if (selectedTopic.note) {
            UI.addNote(selectedTopic.note);
            if (STATE.conversationTarget) {
                UI.updateCharacterInfo(STATE.conversationTarget, selectedTopic.note);
            }
        }
        if (selectedTopic.evidence) {
            UI.addEvidence(selectedTopic.evidence);
            UI.documentEvidence(selectedTopic.evidence, WORLD[STATE.currentRoom].name, 'testimonial');
        }
        if (selectedTopic.reqItem === 'override_chip' && STATE.conversationTarget === 'aria') {
            STATE.flags.chipInstalled = true;
        }

        await new Promise(r => setTimeout(r, 500));
        
        if (STATE.mode === 'CONVERSATION' && STATE.conversationTarget) {
            showConversationOptions();
        }
    } else {
        await UI.printLine("OPTION UNAVAILABLE.", 'txt-error');
    }
}

export async function moveToRoom(newRoomKey) {
    STATE.currentRoom = newRoomKey;
    STATE.turn++;
    Sound.setRoomAmbience(newRoomKey);
    await UI.printLine(`TRANSIT: ${WORLD[newRoomKey].name.toUpperCase()}`, 'txt-sys');
    UI.updateUI();
    await look();
}

