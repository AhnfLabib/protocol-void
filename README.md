<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# PROTOCOL: VOID

A cyberpunk noir text-based murder mystery game set aboard Station Icarus. Play as Detective Kael "Void" Cross and solve the murder of Dr. Silas Vane before the station's orbit decays.

## Features

- **Immersive Terminal Interface** - Retro cyberpunk aesthetic with scanlines and flicker effects
- **Complex Mystery** - Multiple suspects, evidence chains, and dramatic plot twists
- **Documentation System** - Auto-documenting case files for characters, evidence, scenes, and notes
- **Multiple Endings** - Your choices and evidence collection determine the outcome
- **Rich World** - Explore 10 unique locations with atmospheric descriptions
- **Dynamic Sound** - Procedural ambient audio for each location

## Gameplay

Navigate the station, collect evidence, interview suspects, and piece together the mystery. Use commands like `look`, `move`, `inspect`, `talk`, and `accuse` to solve the case.

## Installation

**Prerequisites:** Node.js (v16 or higher)

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/protocol-void.git
   cd protocol-void
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:3000`

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
protocol-void/
├── index.html          # Main game file (all game logic)
├── index.css           # Additional styles
├── package.json        # Dependencies and scripts
├── vite.config.ts      # Vite configuration
└── tsconfig.json       # TypeScript configuration
```

## Technologies

- **Vite** - Fast build tool and dev server
- **Vanilla JavaScript** - No frameworks, pure JS
- **Tailwind CSS** - Utility-first CSS framework
- **Web Audio API** - Procedural sound generation

## License

This project is open source and available under the MIT License.

## Contributing

Contributions, issues, and feature requests are welcome!

## Credits

Created with cyberpunk noir aesthetics and immersive storytelling.
