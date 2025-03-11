import {create} from 'zustand';

interface Choice {
  id: string | number;
  choice: string;
  isCorrect: boolean;
  questionId?: number;
}

interface Question {
  id?: number;
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
  reset: () => void;
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
        {id: new Date().getTime(), question, choices: choices},
      ],
    })),

  reset: () => set(() => ({name: '', description: '', questions: []})),
}));

export default useQuizStore;
