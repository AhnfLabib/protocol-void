// Conversation trees for all NPCs
import { DETECTIVE_NAME } from './config.js';

export const CONVERSATIONS = {
    aria: {
        start: `A.R.I.A: 'Identity confirmed. ${DETECTIVE_NAME}, my core logic is... compromised. Error 404: Memory fragment missing.'`,
        topics: [
            {
                id: 'status',
                text: "Report station status.",
                response: "All systems critical. Life support at 40%. Dr. Vane attempted a manual override before... termination.",
                note: "Vane tried to override the system before dying."
            },
            {
                id: 'witness',
                text: "Did you see the killer?",
                response: "Visual sensors in Server Room were... deleted. However, audio logs remain. I cannot access them without the Override Chip.",
                note: "A.R.I.A needs an Override Chip to access audio logs."
            },
            {
                id: 'alibi',
                text: "Verify Rook's alibi (Scrubbers).",
                reqNote: "Rook claims he was fixing scrubbers.",
                response: "Accessing Maintenance Logs... Confirmed. Rook was sealing a CO2 leak in the Lower Deck at the estimated time of death. He could not be the killer.",
                evidence: "Rook's Alibi",
                note: "Aria confirmed Rook was working during the murder."
            },
            {
                id: 'chip',
                text: "[Use Override Chip] Install chip and unlock memory.",
                reqItem: 'override_chip',
                response: "Accessing... Block removed. Playing Audio Log: 'Vane: You? But why? ... No, put that down! Argh!' ... I detect two voices. One is Vane. The other matches biometric profile: FEMALE.",
                evidence: "Audio Log (Female Voice)",
                note: "The killer is female. This clears Rook of the murder."
            }
        ]
    },
    rook: {
        start: "Rook slams a drawer shut. 'What? I'm busy keeping this rust bucket from exploding.'",
        topics: [
            {
                id: 'alibi',
                text: "Where were you at 0200h?",
                response: "I was here! Fixing the CO2 scrubbers. Ask the tin can (A.R.I.A), she tracks maintenance cycles.",
                note: "Rook claims he was fixing scrubbers."
            },
            {
                id: 'tools',
                text: "[Show Wrench] Is this yours?",
                reqEvidence: 'Murder Weapon',
                response: "Yeah, that's my serial number. But I lost my kit two days ago! Someone swiped it while I was sleeping.",
                note: "Rook claims his tools were stolen."
            },
            {
                id: 'debt',
                text: "[Show Slate] You have a lot of debt, Rook.",
                reqEvidence: "Rook's Debt",
                response: "Rook pales. 'Okay, look. I owe credits. Bad people. But I didn't kill Vane! I was hacking the mess hall credits to pay them off. That's why I was awake!'",
                note: "Rook admits to hacking mess hall, not killing."
            }
        ]
    },
    corinne: {
        start: "Dr. Corinne doesn't look up from her datapad. 'Make it quick. My samples are degrading.'",
        topics: [
            {
                id: 'vane',
                text: "Relationship with Dr. Vane?",
                response: "Silas was a thief. He took my research on Project Chimera and put his name on it. I hated him, yes. But murder is inefficient.",
                note: "Corinne hated Vane for stealing credit."
            },
            {
                id: 'coat',
                text: "[Show Lab Coat] Found this in the vent.",
                reqEvidence: 'Bloody Coat',
                response: "She freezes. 'I... I panicked. I went to talk to him. He was already dead. I saw the blood, slipped... I didn't want to be blamed.'",
                note: "Corinne admits to being at the scene."
            },
            {
                id: 'audio',
                text: "[Show Audio Log] The AI recorded a female voice.",
                reqEvidence: 'Audio Log (Female Voice)',
                response: "Corinne sighs, trembling. 'He was going to sell the AI logic to the military. He was going to wipe A.R.I.A! I just wanted to stop him destroying my creation! He attacked me... it was self defense!'",
                evidence: "Corinne's Confession",
                note: "Corinne confesses to killing Vane in self-defense (or so she claims)."
            }
        ]
    },
    zara: {
        start: "Dr. Zara Chen looks up from her terminal, exhaustion in her eyes. 'Detective Cross. I've been expecting you. Vane was my patient.'",
        topics: [
            {
                id: 'vane_condition',
                text: "What was Vane's condition?",
                response: "He came to me hours before... before it happened. Complained of dizziness, weakness. I ran tests - found traces of a sedative in his system. Someone had been poisoning him slowly.",
                evidence: "Medical Records",
                note: "Vane was weakened before the attack - premeditation."
            },
            {
                id: 'who_poisoned',
                text: "Who could have poisoned him?",
                response: "Anyone with access to medical supplies. But the sedative... it's restricted. Only medical staff and... security have access. Thorne has been acting strange lately.",
                note: "Thorne might have had access to the sedative."
            },
            {
                id: 'timeline',
                text: "What's the medical timeline?",
                response: "Vane came in at 01:30. I treated him, ran tests. He left around 01:45. Medical records show time of death around 02:10, but... that doesn't match what security is saying.",
                evidence: "Time of Death Discrepancy",
                note: "Medical and security timelines don't match."
            }
        ]
    },
    thorne: {
        start: "Officer Marcus Thorne doesn't look up from his monitors. 'Detective. I'm busy reviewing security footage. What do you want?'",
        topics: [
            {
                id: 'footage',
                text: "What does the security footage show?",
                response: "Most of it's corrupted. Missing segments around 02:00 to 02:15. What I can see shows... a struggle. But the killer's face is obscured.",
                evidence: "Security Footage",
                note: "Security footage is partially corrupted, missing key moments."
            },
            {
                id: 'access_logs',
                text: "Show me the access logs.",
                response: "Multiple people accessed the Server Room that night. Rook's card, Jax's card... even Voss's authorization. But biometrics don't match the card users.",
                note: "Access cards were used by different people than their owners."
            },
            {
                id: 'smuggling',
                text: "[Show Smuggling Manifest] Explain this.",
                reqEvidence: 'Smuggling Operation',
                response: "Thorne's face pales. 'That's... classified. Vane found out. He was going to expose me. But I didn't kill him! I was... I was trying to cover it up, yes, but murder? No.'",
                evidence: "Smuggling Operation",
                note: "Thorne admits to smuggling but denies murder."
            },
            {
                id: 'gaps',
                text: "Why are there gaps in the footage?",
                response: "Someone with high-level access deleted those segments. Only Voss or... someone with command codes could do that. I've been trying to recover them.",
                note: "Someone with high access deleted security footage."
            },
            {
                id: 'sedative',
                text: "[Show Poison Traces] Vane was poisoned. You have access to medical supplies.",
                reqEvidence: 'Poison Traces',
                response: "Thorne's face goes pale. 'I... I have access, yes. But I didn't poison him! I was trying to cover up the smuggling, not kill anyone! The sedative... it was for the cargo, not for Vane!'",
                evidence: "Poison Traces",
                note: "Thorne admits to having sedative access but claims it was for smuggling."
            },
            {
                id: 'motive_smuggling',
                text: "Vane found out about your smuggling. That's a strong motive.",
                reqEvidence: 'Smuggling Operation',
                response: "Thorne slams his fist on the console. 'Yes, he found out! Yes, I wanted to shut him up! But murder? No. I was going to pay him off, bribe him. Killing him would bring too much attention. I'm not that stupid.'",
                note: "Thorne admits wanting to silence Vane but denies murder."
            }
        ]
    },
    voss: {
        start: "Commander Helena Voss stands rigid, her uniform immaculate. 'Detective Cross. I trust you're making progress. The station's orbit is decaying. We need answers.'",
        topics: [
            {
                id: 'project_chimera',
                text: "What do you know about Project Chimera?",
                response: "Classified research. Vane and Corinne were working on it. Corporate wants it kept quiet. That's all I can say.",
                note: "Voss knows about Project Chimera but won't elaborate."
            },
            {
                id: 'authorization',
                text: "[Show Command Authorization] Why did you authorize a data purge?",
                reqEvidence: 'Command Authorization',
                response: "Standard protocol after a security breach. I was following procedure. Nothing suspicious about it.",
                evidence: "Command Authorization",
                note: "Voss authorized data purge right after murder - suspicious timing."
            },
            {
                id: 'crew',
                text: "What do you know about the crew?",
                response: "Rook has debts. Corinne and Vane had conflicts. Thorne... has been acting off. Jax is new, transferred in recently. But I don't believe any of them are killers.",
                note: "Voss knows about crew issues but defends them."
            },
            {
                id: 'conspiracy',
                text: "[Show Conspiracy Evidence] Explain these messages.",
                reqEvidence: 'Conspiracy Evidence',
                response: "Voss's composure breaks. 'You... you found them. Fine. Corporate wanted Project Chimera covered up. Vane was going to expose it. We were trying to... contain the situation. But I didn't order his death!'",
                evidence: "Conspiracy Evidence",
                note: "Voss admits to conspiracy but denies ordering the murder."
            }
        ]
    },
    jax: {
        start: "Jax looks up from the console, tension in his shoulders. 'Detective. Rook's been telling you things, hasn't he? Don't believe everything you hear.'",
        topics: [
            {
                id: 'rook',
                text: "What's your relationship with Rook?",
                response: "We work together. That's it. He thinks I'm after his job. Maybe I am. But that doesn't make me a killer.",
                note: "Jax and Rook have a rivalry."
            },
            {
                id: 'access',
                text: "[Show Access Log] Your card accessed Server Room before the murder.",
                reqEvidence: "Jax's Access Log",
                response: "Jax freezes. 'That's... I was doing maintenance. Routine check. I didn't see Vane. I swear!'",
                evidence: "Jax's Access Log",
                note: "Jax was in Server Room just before murder."
            },
            {
                id: 'blackmail',
                text: "[Show Blackmail Evidence] Vane was blackmailing you.",
                reqEvidence: 'Blackmail Evidence',
                response: "Jax's face darkens. 'Yeah. He found out about some... modifications I made. Illegal tech tweaks. He was going to turn me in unless I paid him. But killing him? That's not how I solve problems.'",
                evidence: "Blackmail Evidence",
                note: "Jax admits to being blackmailed but denies murder."
            },
            {
                id: 'chip',
                text: "[Show Chip Trace] The override chip was issued to you.",
                reqEvidence: 'Override Chip Source',
                response: "Jax looks shocked. 'I... I lost it. Weeks ago. Someone must have stolen it. I reported it missing! Check the logs!'",
                evidence: "Override Chip Source",
                note: "Jax claims the chip was stolen from him."
            },
            {
                id: 'motive',
                text: "Why would someone frame you?",
                response: "Jax hesitates. 'Look, I had access. I had motive. But I'm telling you - I didn't do it. Someone's setting me up. Maybe... maybe they wanted me to take the fall.'",
                note: "Jax suggests he's being framed, but evidence is strong against him."
            },
            {
                id: 'timeline',
                text: "Where were you at 02:00?",
                response: "I was... I was in Engineering. But my card was used in Server Room. I don't know how. Unless someone cloned it. Or... or I was drugged and don't remember.'",
                note: "Jax's alibi is weak - card was used but he claims no memory."
            }
        ]
    }
};

