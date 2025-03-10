import {create} from 'zustand';

interface Choice {
  id: string | number;
  choice: string;
  isCorrect: boolean;
  choiceId?: number;
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
  addQuestion: (question: string, choices: Choice[]) => void;
}

const useQuizStore = create<QuizState>((set) => ({
  name: '',
  description: '',
  questions: [],

  setName: (name) => set(() => ({name})),
  setDescription: (description) => set(() => ({description})),

  addQuestion: (question, choices) =>
    set((state) => ({
      questions: [
        ...state.questions,
        {id: crypto.randomUUID(), question, choices: choices},
      ],
    })),
}));

export default useQuizStore;
