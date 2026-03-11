import { create } from "zustand";
import { persist, StateStorage, createJSONStorage } from "zustand/middleware";

const storage: StateStorage = {
    getItem: async (name: string): Promise<string | null> => {
        if (typeof window === "undefined") return null;
        const { get } = await import("idb-keyval");
        return (await get(name)) || null;
    },
    setItem: async (name: string, value: string): Promise<void> => {
        if (typeof window === "undefined") return;
        const { set } = await import("idb-keyval");
        await set(name, value);
    },
    removeItem: async (name: string): Promise<void> => {
        if (typeof window === "undefined") return;
        const { del } = await import("idb-keyval");
        await del(name);
    },
};

export interface Note {
    id: string;
    name: string;
    content: string;
    topic?: string;
    summary?: string;
    keyPoints?: string[];
    importantTerms?: string[];
    createdAt: number;
    updatedAt?: number;
    simplifiedContent?: string;
}

export interface Flashcard {
    id: string;
    noteId?: string;
    front: string;
    back: string;
    nextReviewDate: number; // timestamp
    difficulty: 'easy' | 'medium' | 'hard' | 'new';
    interval: number; // in days
    ease: number; // multiplier
    reviewCount: number;
}

export interface Relationship {
    source: string; // note ID or topic
    target: string; // note ID or topic
    type: string; // e.g., 'related', 'parent', 'child'
}

export interface CourseStep {
    id: string;
    title: string;
    description: string;
    noteIds: string[];
    completed: boolean;
}

export interface Course {
    id: string;
    subject: string;
    steps: CourseStep[];
    createdAt: number;
}

interface AppState {
    notes: Note[];
    flashcards: Flashcard[];
    relationships: Relationship[];
    courses: Course[];
    addNotes: (notes: Note[]) => void;
    updateNote: (id: string, data: Partial<Note>) => void;
    deleteNote: (id: string) => void;
    addFlashcards: (flashcards: Flashcard[]) => void;
    updateFlashcard: (id: string, data: Partial<Flashcard>) => void;
    setFlashcards: (cards: Flashcard[]) => void;
    setNotes: (notes: Note[]) => void;
    setRelationships: (relationships: Relationship[]) => void;
    addRelationships: (relationships: Relationship[]) => void;
    setCourses: (courses: Course[]) => void;
    addCourse: (course: Course) => void;
    clearAll: () => void;
}

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            notes: [],
            flashcards: [],
            relationships: [],
            courses: [],
            addNotes: (newNotes) => set((state) => ({ notes: [...state.notes, ...newNotes] })),
            updateNote: (id, data) =>
                set((state) => ({
                    notes: state.notes.map((n) => (n.id === id ? { ...n, ...data, updatedAt: Date.now() } : n)),
                })),
            deleteNote: (id) => set((state) => ({
                notes: state.notes.filter((n) => n.id !== id),
                flashcards: state.flashcards.filter((f) => f.noteId !== id)
            })),
            addFlashcards: (newCards) => set((state) => ({ flashcards: [...state.flashcards, ...newCards] })),
            updateFlashcard: (id, data) =>
                set((state) => ({
                    flashcards: state.flashcards.map((f) => (f.id === id ? { ...f, ...data } : f)),
                })),
            setFlashcards: (flashcards) => set({ flashcards }),
            setNotes: (notes) => set({ notes }),
            setRelationships: (relationships) => set({ relationships }),
            addRelationships: (newRels) => set((state) => ({ relationships: [...state.relationships, ...newRels] })),
            setCourses: (courses) => set({ courses }),
            addCourse: (course) => set((state) => ({ courses: [...state.courses, course] })),
            clearAll: () => set({ notes: [], flashcards: [], relationships: [], courses: [] }),
        }),
        {
            name: "ai-notes-storage-v2",
            storage: createJSONStorage(() => storage),
        }
    )
);
