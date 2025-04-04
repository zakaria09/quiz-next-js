import {create} from 'zustand';

interface Choice {
  id: string;
  choice: string;
  isCorrect: boolean;
  questionId?: number;
}

interface Question {
  id?: number;
  question: string;
  choices: Choice[];
}

interface User {
  id: string;
  name: string;
}
interface QuizState {
  name: string;
  description: string;
  questions: Question[];
  users: User[];
  quizResultId: number | null;
  selectedChoices: Choice[];
  setName: (name: string) => void;
  setDescription: (description: string) => void;
  setUsers: (users: User[]) => void;
  setselectedChoices: (selectedChoices: Choice[]) => void;
  addQuestion: (question: string, choices: Choice[]) => void;
  setQuizResultId: (quizResultId: number) => void;
  reset: () => void;
}

const useQuizStore = create<QuizState>((set) => ({
  name: '',
  description: '',
  questions: [],
  selectedChoices: [],
  quizResultId: null,
  users: [],

  setName: (name) => set(() => ({name})),
  setDescription: (description) => set(() => ({description})),
  setQuizResultId: (quizResultId: number) => set(() => ({quizResultId})),
  setUsers: (users: User[]) => set(() => ({users})),

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
