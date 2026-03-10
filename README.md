# AI Notes Organizer

A production-ready Progressive Web App (PWA) built with Next.js App Router, Tailwind CSS, and Zustand.

This application allows you to upload messy notes (txt, md, pdf, docx, folders) and uses the SambaNova AI API to organize them, extract summaries, generate flashcards, and let you chat with your knowledge base.

## Features

- **PWA Ready**: Offline-first storage with `idb-keyval` and `zustand/middleware`.
- **Beautiful UI**: Dark mode glassmorphism interface with `lucide-react` icons and `framer-motion` inspired styling.
- **Smart AI Organization**: Automatically categorizes files into topics with AI-generated summaries and key points.
- **Flashcard Generation**: Extracts questions and answers directly from uploaded notes for studying.
- **Chat with Notes**: A RAG-lite experience entirely on the client side sending your context to the SambaNova API through a secure Next.js edge-friendly backend route.

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repo_url>
   cd ai-notes-organizer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Environment Variables:
   Copy `.env.example` to `.env` and configure your API key.
   ```bash
   cp .env.example .env
   ```
   Add your `SAMBANOVA_API_KEY` to `.env`.

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment on Vercel

1. Push this repository to GitHub.
2. Go to Vercel and create a new project.
3. Import the GitHub repository.
4. In the Environment Variables section, add `SAMBANOVA_API_KEY`.
5. Deploy! Vercel will automatically build the Next.js project and deploy the PWA.

## Architecture

- **Frontend**: Next.js 15 (React 19), Tailwind CSS v4, Zustand (indexedDB persistence).
- **Backend API**: Next.js API Routes (Node.js runtime required for `pdf-parse` and `mammoth`).
- **AI**: SambaNova `Meta-Llama-3.1-8B-Instruct`.

## Security

The `SAMBANOVA_API_KEY` is fully protected:
- Never exposed to the browser.
- Uses server-side API routes (`/api/analyze`, `/api/chat`, `/api/flashcards`) to interact with the LLM.
