import { create } from "zustand";

interface Choice {
  id: string;
  choice: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  question: string;
  choices: Choice[];
}

interface QuizState {
  name: string;
  description: string;
  questions: Question[];
  setName: (name: string) => void;
  setDescription: (description: string) => void;
  addQuestion: (question: string) => void;
  updateQuestion: (id: string, question: string) => void;
  removeQuestion: (id: string) => void;
  addChoice: (questionId: string, choice: string, isCorrect?: boolean) => void;
  updateChoice: (
    questionId: string,
    choiceId: string,
    choice: string,
    isCorrect: boolean
  ) => void;
  removeChoice: (questionId: string, choiceId: string) => void;
}

const useQuizStore = create<QuizState>((set) => ({
  name: "",
  description: "",
  questions: [],

  setName: (name) => set(() => ({ name })),
  setDescription: (description) => set(() => ({ description })),

  addQuestion: (question) =>
    set((state) => ({
      questions: [
        ...state.questions,
        { id: crypto.randomUUID(), question, choices: [] },
      ],
    })),

  updateQuestion: (id, question) =>
    set((state) => ({
      questions: state.questions.map((q) =>
        q.id === id ? { ...q, question } : q
      ),
    })),

  removeQuestion: (id) =>
    set((state) => ({
      questions: state.questions.filter((q) => q.id !== id),
    })),

  addChoice: (questionId, choice, isCorrect = false) =>
    set((state) => ({
      questions: state.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              choices: [
                ...q.choices,
                { id: crypto.randomUUID(), choice, isCorrect },
              ],
            }
          : q
      ),
    })),

  updateChoice: (questionId, choiceId, choice, isCorrect) =>
    set((state) => ({
      questions: state.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              choices: q.choices.map((c) =>
                c.id === choiceId ? { ...c, choice, isCorrect } : c
              ),
            }
          : q
      ),
    })),

  removeChoice: (questionId, choiceId) =>
    set((state) => ({
      questions: state.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              choices: q.choices.filter((c) => c.id !== choiceId),
            }
          : q
      ),
    })),
}));

export default useQuizStore;
