<div align="center">
  <img src="/public/icon-192x192.png" alt="NotePilot AI Logo" width="120" height="120" />
  
  # NotePilot AI v2.0
  
  ### *Your Chaotic Mess, Synthesized onto your Personal Second Brain.*
  
  [![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)
  [![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
  [![SambaNova AI](https://img.shields.io/badge/AI-SambaNova-orange)](https://cloud.sambanova.ai/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

  [Features](#-features) • [Installation](#-quick-start) • [Tech Stack](#-tech-stack) • [Roadmap](#-roadmap) • [Contributing](#-contributing)
</div>

---

## 🧠 About NotePilot AI
NotePilot AI is a world-class **Personal Knowledge Management (PKM)** system and study suite. It transforms unstructured text, markdown, and documents into a logically structured "Second Brain." Using the cutting-edge **SambaNova AI** engine, NotePilot doesn't just store your notes—it understands them.

## ✨ Features

### 🌪️ Chaos to Knowledge
Drop a folder of messy `.txt` or `.md` files. AI automatically renames, categorizes, and summarizes them into logical topics.

### 🕸️ Semantic Knowledge Graph
Visualize the architecture of your brain. See how "Quantum Physics" relates to "Linear Algebra" through conceptual threads identified by AI.

### 🎓 Smart Study Arena
- **Auto-Flashcards**: Instant Spaced Repetition (SM-2) cards generated from your content.
- **Study Mode**: Interactive quizzes that provide deep logical insights for every answer.
- **Course Builder**: Automatic learning paths (101 -> Advanced) curated from your materials.

### 💬 Brain Chat (RAG)
Chat with your entire library. NotePilot uses **Retrieval-Augmented Generation** to answer questions with direct citations (links) to your source notes.

### 📝 Exam Revision Generator
Generating high-density revision guides, key formulas, and custom 7-day study plans for any topic in your dashboard.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Intelligence**: [SambaNova Cloud](https://cloud.sambanova.ai/) (Llama 3.1 405B/70B/8B)
- **State Architecture**: [Zustand](https://github.com/pmndrs/zustand) + [IndexedDB](https://github.com/jakearchibald/idb-keyval) (Offline Persistence)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (Glassmorphism System)
- **Visualization**: [React Force Graph](https://github.com/vasturiano/react-force-graph)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Quick Start

### 1. Requirements
- Node.js 20+
- SambaNova API Key

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-username/ai-notes-organizer.git

# Enter directory
cd ai-notes-organizer

# Install dependencies
npm install
```

### 3. Configuration
Create a `.env` file in the root:
```env
SAMBANOVA_API_KEY=your_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Lift off
```bash
npm run dev
```
Visit `localhost:3000` to start sync.

---

## 🗺 Roadmap
- [x] v2.0 Knowledge Graph & Course Builder
- [ ] PDF & Docx native parsing support (Server-side)
- [ ] Voice-to-Note (AI Transcription)
- [ ] Collaborative Shareable Brains
- [ ] Mobile App (Capacitor/React Native)

---

## 🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

## 📧 Contact
Project Link: [https://github.com/your-username/ai-notes-organizer](https://github.com/your-username/ai-notes-organizer)

<div align="center">
  Built with ❤️ for learners everywhere.
</div>
