// World data: rooms and items
export const WORLD = {
    docking_bay: {
        name: "Docking Bay 4",
        desc: "The airlock hisses with residual pressure. Your shuttle has just detached. Station Icarus is silent. To the NORTH is the Main Hall.",
        exits: { north: 'main_hall' },
        items: [],
        npc: null,
        ambience: 'rumble'
    },
    main_hall: {
        name: "Main Hall",
        desc: "The central hub. Emergency lighting casts long shadows. Commander Voss stands near the command console, her expression unreadable. Paths lead NORTH (Server), WEST (Engineering), EAST (Cryo), SOUTH (Docking), NORTHEAST (Medical), NORTHWEST (Security).",
        exits: { north: 'server_room', west: 'engineering', east: 'cryo_bay', south: 'docking_bay', northeast: 'medical_bay', northwest: 'security_office' },
        items: ['command_authorization'],
        npc: 'voss',
        ambience: 'drone'
    },
    engineering: {
        name: "Engineering",
        desc: "The hum of engines is overwhelming. Oil stains the floor. There's a workbench and lockers here. Rook is working at a console, while Jax is nearby. To the EAST is the Main Hall.",
        exits: { east: 'main_hall' },
        items: ['bloody_wrench'],
        npc: 'rook',
        ambience: 'throb'
    },
    cryo_bay: {
        name: "Cryo Bay",
        desc: "Frigid air bites your skin. Most pods are empty. A ventilation grate rattles loosely on the wall. To the WEST is the Main Hall.",
        exits: { west: 'main_hall' },
        items: ['tablet'],
        npc: 'corinne',
        ambience: 'wind'
    },
    server_room: {
        name: "Server Room",
        desc: "Rows of black monolith servers. In the center, the body of Dr. Silas Vane lies slumped over the master console. To the SOUTH is the Main Hall.",
        exits: { south: 'main_hall' },
        items: ['encrypted_drive'],
        npc: null,
        ambience: 'electric'
    },
    medical_bay: {
        name: "Medical Bay",
        desc: "Sterile white walls stained with something dark. Medical equipment beeps erratically. Dr. Zara Chen is reviewing patient logs at a terminal. The air smells of antiseptic and something metallic. To the SOUTHWEST is the Main Hall, WEST is Quarters.",
        exits: { southwest: 'main_hall', west: 'quarters' },
        items: ['medical_logs', 'poison_vial'],
        npc: 'zara',
        ambience: 'wind'
    },
    security_office: {
        name: "Security Office",
        desc: "Banks of monitors flicker with static. Officer Marcus Thorne is hunched over access logs, his face tense. Security footage plays on loop. To the SOUTHEAST is the Main Hall, EAST is Communications Hub.",
        exits: { southeast: 'main_hall', east: 'communications_hub' },
        items: ['security_footage_drive', 'access_card_log', 'smuggling_manifest'],
        npc: 'thorne',
        ambience: 'throb'
    },
    communications_hub: {
        name: "Communications Hub",
        desc: "Antenna arrays stretch into the void. Message logs scroll endlessly. No one is here - the system runs automated. To the WEST is Security Office, NORTH is Research Lab.",
        exits: { west: 'security_office', north: 'research_lab' },
        items: ['message_logs'],
        npc: null,
        ambience: 'drone'
    },
    research_lab: {
        name: "Research Lab (Project Chimera)",
        desc: "Abandoned workstations. Research notes scattered everywhere. This is where Vane and Corinne worked on Project Chimera. The air is thick with the smell of ozone and something else - fear. To the SOUTH is Communications Hub, WEST is Main Hall.",
        exits: { south: 'communications_hub', west: 'main_hall' },
        items: ['project_chimera_files', 'chip_trace_log', 'time_discrepancy_report'],
        npc: null,
        ambience: 'electric'
    },
    quarters: {
        name: "Quarters",
        desc: "Living quarters for the crew. Personal effects scattered about. You can search through individual rooms. Something feels off here. To the EAST is Medical Bay, SOUTHEAST is Main Hall.",
        exits: { east: 'medical_bay', southeast: 'main_hall' },
        items: ['personal_datapad', 'conspiracy_evidence'],
        npc: null,
        ambience: 'rumble'
    }
};

export const ITEMS = {
    bloody_wrench: {
        name: "Bloody Wrench",
        desc: "Heavy engineering tool. Crusted with blood.",
        evidence: "Murder Weapon"
    },
    tablet: {
        name: "Corinne's Tablet",
        desc: "Unlocks with a standard biometric bypass. It contains angry emails to Vane accusing him of 'stealing her life's work'.",
        evidence: "Corinne's Motive"
    },
    encrypted_drive: {
        name: "Vane's Drive",
        desc: "A bio-locked drive found on the victim. High-level encryption.",
        evidence: null
    },
    override_chip: {
        name: "AI Override Chip",
        desc: "A rare hardware key used to bypass AI logic locks. Found in Rook's toolkit.",
        evidence: null
    },
    gambling_slate: {
        name: "Digital Slate",
        desc: "Found in Rook's locker. It shows massive debts to an off-world syndicate.",
        evidence: "Rook's Debt"
    },
    lab_coat: {
        name: "Torn Lab Coat",
        desc: "Found stuffed in the vent. It's stained with blood and smells of server coolant.",
        evidence: "Bloody Coat"
    },
    medical_logs: {
        name: "Medical Records",
        desc: "Dr. Chen's patient logs. Shows Vane was treated for weakness and dizziness hours before death. Toxicology report indicates traces of a sedative.",
        evidence: "Medical Records"
    },
    security_footage_drive: {
        name: "Security Footage Drive",
        desc: "Contains surveillance footage from the night of the murder. Some segments are missing or corrupted.",
        evidence: "Security Footage"
    },
    message_logs: {
        name: "Message Logs",
        desc: "Intercepted communications. Shows suspicious off-station messages around the time of death.",
        evidence: "Off-Station Communications"
    },
    project_chimera_files: {
        name: "Project Chimera Files",
        desc: "Detailed research notes. Shows Vane's name on work clearly done by Corinne. Dates prove theft.",
        evidence: "Research Theft Proof"
    },
    personal_datapad: {
        name: "Personal Datapad",
        desc: "Found in quarters. Contains blackmail messages from Vane to Jax about illegal tech modifications.",
        evidence: "Blackmail Evidence"
    },
    poison_vial: {
        name: "Sedative Vial",
        desc: "Found in Medical Bay. Empty. Matches the sedative found in Vane's system.",
        evidence: "Poison Traces"
    },
    access_card_log: {
        name: "Access Card Log",
        desc: "Shows Jax's access card was used to enter Server Room at 01:55, just before the murder.",
        evidence: "Jax's Access Log"
    },
    command_authorization: {
        name: "Command Authorization",
        desc: "Voss authorized something suspicious - a data purge right after Vane's death.",
        evidence: "Command Authorization"
    },
    smuggling_manifest: {
        name: "Smuggling Manifest",
        desc: "Found in Security Office. Shows Thorne was involved in illegal cargo operations.",
        evidence: "Smuggling Operation"
    },
    chip_trace_log: {
        name: "Chip Trace Log",
        desc: "Technical logs showing the override chip was issued to Jax, not Rook.",
        evidence: "Override Chip Source"
    },
    time_discrepancy_report: {
        name: "Time Discrepancy Report",
        desc: "Medical records show time of death at 02:10, but security logs show activity until 02:15.",
        evidence: "Time of Death Discrepancy"
    },
    conspiracy_evidence: {
        name: "Conspiracy Evidence",
        desc: "Multiple encrypted messages between Voss, Thorne, and an unknown party about covering up Project Chimera.",
        evidence: "Conspiracy Evidence"
    }
};

