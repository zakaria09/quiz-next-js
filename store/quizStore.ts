import {create} from 'zustand';

interface Choice {
  id: string;
  choice: string;
  isCorrect: boolean;
  questionId: number;
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
  selectedChoices: Choice[];
  setName: (name: string) => void;
  setDescription: (description: string) => void;
  setselectedChoices: (selectedChoices: Choice[]) => void;
  addQuestion: (question: string, choices: Choice[]) => void;
  reset: () => void;
}

const useQuizStore = create<QuizState>((set) => ({
  name: '',
  description: '',
  questions: [],
  selectedChoices: [],

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

  setselectedChoices: (selectedChoices: Choice[]) =>
    set((state) => ({
      ...state,
      selectedChoices: [...state.selectedChoices, ...selectedChoices],
    })),
}));

export default useQuizStore;
