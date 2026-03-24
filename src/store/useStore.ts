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
    studyPath?: Array<{ step: number; task: string }>;
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
    xp: number;
    level: number;
    streak: number;
    lastActive: number;
    totalTimeSaved: number;
    dailyGoal: number;
    cardsReviewedToday: number;
    generationCount: number;
    isSidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
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
    addXp: (amount: number) => void;
    addTimeSaved: (minutes: number) => void;
    updateStreak: () => void;
    incrementGeneration: () => void;
    resetDailyStats: () => void;
    clearAll: () => void;
}

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            notes: [],
            flashcards: [],
            relationships: [],
            courses: [],
            xp: 0,
            level: 1,
            streak: 0,
            lastActive: Date.now(),
            totalTimeSaved: 0,
            dailyGoal: 20,
            cardsReviewedToday: 0,
            generationCount: 0,
            isSidebarOpen: false,
            setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
            addNotes: (newNotes) => set((state) => {
                const xpGain = newNotes.length * 50;
                const newXp = state.xp + xpGain;
                const newLevel = Math.floor(newXp / 1000) + 1;
                return { 
                    notes: [...state.notes, ...newNotes],
                    xp: newXp,
                    level: newLevel,
                    totalTimeSaved: state.totalTimeSaved + (newNotes.length * 15),
                    generationCount: state.generationCount + 1
                };
            }),
            updateNote: (id, data) =>
                set((state) => ({
                    notes: state.notes.map((n) => (n.id === id ? { ...n, ...data, updatedAt: Date.now() } : n)),
                })),
            deleteNote: (id) => set((state) => ({
                notes: state.notes.filter((n) => n.id !== id),
                flashcards: state.flashcards.filter((f) => f.noteId !== id)
            })),
            addFlashcards: (newCards) => set((state) => ({ 
                flashcards: [...state.flashcards, ...newCards],
                xp: state.xp + (newCards.length * 10)
            })),
            updateFlashcard: (id, data) =>
                set((state) => {
                    const isReview = !!data.difficulty;
                    const isSuccess = data.difficulty && data.difficulty !== 'hard';
                    return {
                        flashcards: state.flashcards.map((f) => (f.id === id ? { ...f, ...data } : f)),
                        xp: isSuccess ? state.xp + 20 : state.xp + 5,
                        cardsReviewedToday: isReview ? state.cardsReviewedToday + 1 : state.cardsReviewedToday
                    };
                }),
            setFlashcards: (flashcards) => set({ flashcards }),
            setNotes: (notes) => set({ notes }),
            setRelationships: (relationships) => set({ relationships }),
            addRelationships: (newRels) => set((state) => ({ relationships: [...state.relationships, ...newRels] })),
            setCourses: (courses) => set({ courses }),
            addCourse: (course) => set((state) => ({ courses: [...state.courses, course] })),
            addXp: (amount) => set((state) => {
                const newXp = state.xp + amount;
                const newLevel = Math.floor(newXp / 1000) + 1;
                return { xp: newXp, level: newLevel };
            }),
            addTimeSaved: (minutes) => set((state) => ({ totalTimeSaved: state.totalTimeSaved + minutes })),
            updateStreak: () => set((state) => {
                const now = Date.now();
                const diff = now - state.lastActive;
                const oneDay = 24 * 60 * 60 * 1000;
                
                // Reset daily stats if it's a new day
                const isNewDay = new Date(now).toDateString() !== new Date(state.lastActive).toDateString();
                
                let newStreak = state.streak;
                if (diff < oneDay * 2) {
                    if (isNewDay) newStreak += 1;
                } else {
                    newStreak = 1;
                }
                
                return { 
                    streak: newStreak, 
                    lastActive: now,
                    cardsReviewedToday: isNewDay ? 0 : state.cardsReviewedToday 
                };
            }),
            incrementGeneration: () => set((state) => ({ generationCount: state.generationCount + 1 })),
            resetDailyStats: () => set({ cardsReviewedToday: 0 }),
            clearAll: () => set({ notes: [], flashcards: [], relationships: [], courses: [], xp: 0, level: 1, streak: 0, totalTimeSaved: 0, cardsReviewedToday: 0, generationCount: 0 }),
        }),
        {
            name: "ai-notes-storage-v2",
            storage: createJSONStorage(() => storage),
        }
    )
);
