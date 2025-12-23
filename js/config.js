// Game Configuration
export const DETECTIVE_NAME = "Kael \"Void\" Cross";

// Evidence connection hints
export const EVIDENCE_CONNECTIONS = {
    "Corinne's Confession": ["Audio Log (Female Voice)", "Bloody Coat", "Corinne's Motive"],
    "Audio Log (Female Voice)": ["Corinne's Confession", "Bloody Coat"],
    "Bloody Coat": ["Corinne's Confession", "Audio Log (Female Voice)"],
    "Jax's Access Log": ["Blackmail Evidence", "Override Chip Source"],
    "Blackmail Evidence": ["Jax's Access Log", "Override Chip Source"],
    "Override Chip Source": ["Jax's Access Log", "Blackmail Evidence"],
    "Command Authorization": ["Conspiracy Evidence", "Smuggling Operation"],
    "Conspiracy Evidence": ["Command Authorization", "Smuggling Operation"],
    "Smuggling Operation": ["Command Authorization", "Conspiracy Evidence"],
    "Medical Records": ["Poison Traces", "Time of Death Discrepancy"],
    "Poison Traces": ["Medical Records", "Time of Death Discrepancy"],
    "Time of Death Discrepancy": ["Medical Records", "Poison Traces"]
};

// Obfuscated suspect and evidence keys
export const SUSPECT_KEYS = {
    'a': 'corinne',
    'b': 'jax',
    'c': 'thorne',
    'd': 'voss',
    'e': 'rook',
    'f': 'aria'
};

export const EVIDENCE_KEYS = {
    'ev1': "Corinne's Confession",
    'ev2': "Jax's Access Log",
    'ev3': "Blackmail Evidence",
    'ev4': "Override Chip Source",
    'ev5': "Smuggling Operation",
    'ev6': "Security Footage",
    'ev7': "Command Authorization",
    'ev8': "Conspiracy Evidence"
};

