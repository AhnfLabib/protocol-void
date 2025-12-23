// Sound system for procedural audio
import { WORLD } from './world.js';

export const Sound = {
    ctx: null,
    ambientGain: null,
    ambientNodes: [],

    init: function() {
        if (this.ctx) return;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.ambientGain = this.ctx.createGain();
            this.ambientGain.gain.value = 0.15;
            this.ambientGain.connect(this.ctx.destination);
        } catch (e) {
            console.warn('Audio context not available');
        }
    },

    stopAmbient: function() {
        this.ambientNodes.forEach(node => {
            try { node.stop(); } catch(e) {}
        });
        this.ambientNodes = [];
    },

    createNoiseBuffer: function() {
        if (!this.ctx) return null;
        const bufferSize = this.ctx.sampleRate * 2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        return buffer;
    },

    playAmbient: function(type) {
        this.stopAmbient();
        if (!this.ctx) return;
        
        if (type === 'drone') { // Main Hall
            const osc = this.ctx.createOscillator();
            osc.frequency.value = 60;
            osc.type = 'sine';
            const osc2 = this.ctx.createOscillator();
            osc2.frequency.value = 120;
            osc2.type = 'sine';
            const gain = this.ctx.createGain();
            gain.gain.value = 0.1;
            
            osc.connect(gain);
            osc2.connect(gain);
            gain.connect(this.ambientGain);
            
            osc.start();
            osc2.start();
            this.ambientNodes.push(osc, osc2);
        }
        else if (type === 'rumble') { // Docking Bay
            const osc = this.ctx.createOscillator();
            osc.frequency.value = 30;
            osc.type = 'sawtooth';
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 100;
            
            osc.connect(filter);
            filter.connect(this.ambientGain);
            osc.start();
            this.ambientNodes.push(osc);
        }
        else if (type === 'throb') { // Engineering
            const osc = this.ctx.createOscillator();
            osc.type = 'sawtooth';
            osc.frequency.value = 50;
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 200;
            
            const lfo = this.ctx.createOscillator();
            lfo.type = 'sine';
            lfo.frequency.value = 2;
            const lfoGain = this.ctx.createGain();
            lfoGain.gain.value = 50;
            
            lfo.connect(lfoGain);
            lfoGain.connect(filter.frequency);
            
            osc.connect(filter);
            filter.connect(this.ambientGain);
            
            osc.start();
            lfo.start();
            this.ambientNodes.push(osc, lfo);
        }
        else if (type === 'wind') { // Cryo Bay
            const noise = this.ctx.createBufferSource();
            noise.buffer = this.createNoiseBuffer();
            noise.loop = true;
            
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.value = 800;
            
            noise.connect(filter);
            filter.connect(this.ambientGain);
            noise.start();
            this.ambientNodes.push(noise);
        }
        else if (type === 'electric') { // Server Room
            const hum = this.ctx.createOscillator();
            hum.frequency.value = 120;
            hum.type = 'square';
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 400;
            
            hum.connect(filter);
            filter.connect(this.ambientGain);
            hum.start();
            this.ambientNodes.push(hum);
        }
    },

    playTone: function(freq, type, duration, vol = 0.1) {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type; 
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    },
    
    blip: function() { 
        const f = 800 + Math.random() * 200;
        this.playTone(f, 'square', 0.05, 0.02); 
    },
    
    success: function() { 
        this.playTone(440, 'sine', 0.1, 0.1);
        setTimeout(() => this.playTone(880, 'sine', 0.3, 0.1), 100);
    },
    
    error: function() { 
        this.playTone(150, 'sawtooth', 0.3, 0.1);
        setTimeout(() => this.playTone(100, 'sawtooth', 0.3, 0.1), 150);
    },
    
    start: function() { this.playTone(220, 'sine', 1, 0.1); },

    setRoomAmbience: function(roomKey) {
        const type = WORLD[roomKey].ambience;
        if (type) this.playAmbient(type);
        else this.stopAmbient();
    }
};

