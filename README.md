# 🚀 NotePilot AI v2.0

> **Transform Your Messy Notes into a Structured Digital Second Brain.**

NotePilot AI is a high-performance, AI-native Personal Knowledge Management (PKM) system. Built with Next.js 15, Tailwind CSS, and powered by the SambaNova AI Engine, it automatically categorizes your unstructured files, builds interactive knowledge graphs, and generates smart study assets like flashcards and quizzes.

![NotePilot Banner](https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&q=80&w=2000&h=600)

## ✨ Core Features

### 🧠 Semantic Organization
- **Intelligent Batch Processing**: Drag and drop entire folders of messy `.txt`, `.md`, `.pdf`, and `.docx` files.
- **Auto-Categorization**: AI analyzes the content of every file and suggests the perfect topic and folder structure.
- **Metadata Extraction**: Automatic generation of summaries, key points, and important terms.

### 🕸️ Knowledge Graph
- **Concept Mapping**: Visualize relationships between your notes and topics in a dynamic 3D-force-directed graph.
- **Pattern Discovery**: See how your ideas connect across different subjects automatically.

### 🎓 AI Academy
- **Flashcard Engine**: Automatic generation of flashcards using the SM-2 Spaced Repetition algorithm.
- **Smart Quizzes**: Dynamic quizzes generated from your own notes to test your understanding.
- **Explain Simply**: One-click "Explain to a Beginner" mode for complex topics.

### 🔍 Semantic Search
- **Meanings, Not Keywords**: Find notes based on concepts and context rather than just exact string matches.

## 🛠️ Tech Stack

- **Frontend**: [Next.js 15](https://nextjs.org/) (App Router), [React 19](https://reactjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) + [idb-keyval](https://github.com/jakearchibald/idb-keyval) for persistence
- **AI Engine**: [SambaNova Cloud](https://sambanova.ai/) (Llama 3.1 70B/405B)
- **Visuals**: [React Force Graph](https://github.com/vasturiano/react-force-graph), [Lucide React](https://lucide.dev/)
- **PWA**: [Serwist](https://serwist.js.org/) for offline support and native-like experience

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/rohanvibe/NotePilot-AI.git
cd NotePilot-AI
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env.local` file in the root directory:
```env
SAMBANOVA_API_KEY=your_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run the development server
```bash
npm run dev
```

## 📱 PWA Features
NotePilot is a fully compliant PWA with:
- **Perfect 44/44 PWA Builder Score**
- **Offline Support**: Access your notes even without an internet connection.
- **Background Sync**: Seamlessly sync changes when you come back online.
- **Push Notifications**: Personalized study reminders.

## 📄 License
NotePilot AI is released under the [MIT License](LICENSE).

---
Built with ❤️ for lifelong learners.
