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
}

export interface Flashcard {
    id: string;
    front: string;
    back: string;
}

interface AppState {
    notes: Note[];
    flashcards: Flashcard[];
    addNotes: (notes: Note[]) => void;
    updateNote: (id: string, data: Partial<Note>) => void;
    addFlashcards: (flashcards: Flashcard[]) => void;
    setNotes: (notes: Note[]) => void;
    clearAll: () => void;
}

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            notes: [],
            flashcards: [],
            addNotes: (newNotes) => set((state) => ({ notes: [...state.notes, ...newNotes] })),
            updateNote: (id, data) =>
                set((state) => ({
                    notes: state.notes.map((n) => (n.id === id ? { ...n, ...data } : n)),
                })),
            addFlashcards: (newCards) => set((state) => ({ flashcards: [...state.flashcards, ...newCards] })),
            setNotes: (notes) => set({ notes }),
            clearAll: () => set({ notes: [], flashcards: [] }),
        }),
        {
            name: "ai-notes-storage",
            storage: createJSONStorage(() => storage),
        }
    )
);
