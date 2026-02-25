# Terminal Wellbeing AI

A mental health chatbot with a terminal-like interface, built using React and TypeScript. This application provides a supportive conversation experience for users seeking mental health support.

## Features

- Terminal-style interface with typewriter effect for bot responses
- AI-powered conversations using multiple Hugging Face transformer models
- Model switching capability to choose between different AI models
- Sensitive topic detection and supportive responses
- Enhanced natural language processing for more conversational interactions
- Command system for help, resources, model switching, and clearing conversation
- Responsive design that works on desktop and mobile devices

## Tech Stack

This project uses a streamlined tech stack focused on simplicity and performance:

- **React** (v18.3.1): Modern UI library for building the interface
- **TypeScript** (v5.0.2): Type-safe JavaScript for better developer experience
- **Tailwind CSS** (v3.4.11): Utility-first CSS framework for styling without bloat
- **Vite** (v4.4.5): Fast build tool and development server with HMR
- **Hugging Face Transformers** (v3.5.1): AI model for natural language processing
- **Jest** (v29.7.0) & **Testing Library** (v14.0.0): Comprehensive testing framework

### Dependencies

- `react-dom`: v18.3.1
- `react-router-dom`: v6.26.2
- `lucide-react`: v0.462.0 (Lightweight icon library)

### Development Dependencies

- `@testing-library/jest-dom`: v6.1.4
- `@testing-library/user-event`: v14.5.1
- `@types/jest`: v29.5.5
- `@types/node`: v20.11.30
- `@types/react`: v18.2.15
- `@types/react-dom`: v18.2.7
- `@typescript-eslint/eslint-plugin`: v6.0.0
- `@typescript-eslint/parser`: v6.0.0
- `@vitejs/plugin-react`: v4.0.3
- `autoprefixer`: v10.4.21
- `eslint`: v8.45.0
- `postcss`: v8.4.47
- `ts-jest`: v29.1.1

## Mobile Access

To test the application on a mobile device connected to the same Wi-Fi network:

1. Run the mobile development server:
   ```bash
   npm run dev:mobile
   ```
   This exposes the server on `0.0.0.0` (all network interfaces).

2. Find your computer's local IP address:
   - **Windows:** Run `ipconfig` in a terminal and look for "IPv4 Address" (e.g., `192.168.1.5`).
   - **macOS/Linux:** Run `ifconfig` or `ip a` and look for the `inet` address (e.g., `192.168.1.5`).

3. Open a browser on your mobile device and navigate to `http://<YOUR_IP>:8080`.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at http://localhost:8080

### Testing

Run tests:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

### Building for Production

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
src/
├── components/       # UI components
│   ├── Terminal.tsx  # Main terminal component
│   ├── TerminalHeader.tsx
│   ├── TerminalInput.tsx
│   ├── TerminalOutput.tsx
│   └── TerminalMessage.tsx
├── utils/            # Utility functions
│   ├── aiModel.ts    # AI model integration
│   └── commands.ts   # Command processing
├── data/             # Data and content
│   └── responses.ts  # System responses
├── App.tsx           # Root component
└── main.tsx          # Entry point
```

## Usage

After starting the application, you can interact with the chatbot by typing messages. The bot will respond in a conversational manner, providing support and resources for mental health concerns.

Available commands:

- `/help` - Display available commands
- `/resources` - Show mental health resources
- `/models` - List available AI models
- `/model <number>` - Switch to a different AI model
- `/clear` - Clear the conversation history

### AI Model Switching

The application now supports multiple AI models with different capabilities:

1. **DistilGPT-2** - Lightweight general-purpose model (default)
2. **GPT-2** - Larger general-purpose model with better context handling
3. **GPT-Neo** - Open-source GPT alternative with improved reasoning

To switch between models, use the `/model <number>` command, where `<number>` is the index of the model you want to use (e.g., `/model 1` to switch to GPT-2). Use `/models` to see all available models and their current status.

## AI Models

The application now supports multiple AI models from Hugging Face for generating responses:

- **DistilGPT-2**: A lightweight model that balances performance and resource usage
- **GPT-2**: A more powerful model with better context understanding and response generation
- **GPT-Neo**: An open-source alternative with improved reasoning capabilities

The system intelligently handles model initialization, loading the primary model first for immediate use while loading additional models in the background. If the active model fails to generate a satisfactory response, the system automatically falls back to other available models or predefined responses.

This multi-model approach provides several benefits:

1. **Redundancy**: If one model fails, others can take over
2. **Choice**: Users can select the model that works best for their needs
3. **Resource optimization**: Smaller models can be used on devices with limited resources
4. **Better responses**: Different models have different strengths for various conversation types

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.
