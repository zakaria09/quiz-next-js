import { create } from "zustand";
import { v4 as uuidv4 } from "uuid"; // Import the v4 method from uuid

interface Choice {
  id: string;
  choice: string;
  isCorrect: boolean;
  questionId?: string;
}

interface Question {
  id?: string; // Updated to string to match UUID format
  question: string;
  quizId?: number;
  choices: Choice[];
}
interface QuizState {
  name: string;
  description: string;
  questions: Question[];
  quizResultId: number | null;
  selectedChoices: Choice[];
  setName: (name: string) => void;
  setDescription: (description: string) => void;
  setselectedChoices: (selectedChoices: Choice[]) => void;
  addQuestion: (question: string, choices: Choice[]) => void;
  addQuestions: (questions: Question[]) => void;
  setQuizResultId: (quizResultId: number) => void;
  reset: () => void;
}

const useQuizStore = create<QuizState>((set) => ({
  name: "",
  description: "",
  questions: [],
  selectedChoices: [],
  quizResultId: null,

  setName: (name) => set(() => ({ name })),
  setDescription: (description) => set(() => ({ description })),
  setQuizResultId: (quizResultId: number) => set(() => ({ quizResultId })),

  addQuestion: (question, choices) =>
    set((state) => ({
      questions: [
        ...state.questions,
        { id: uuidv4(), question, choices: choices }, // Use uuidv4 to generate a unique ID
      ],
    })),

  addQuestions: (questions) =>
    set((state) => ({
      questions: [
        ...state.questions,
        ...questions.map((question) => ({
          id: uuidv4(), // Use uuidv4 to generate a unique ID
          question: question.question,
          choices: question.choices.map((choice) => ({
            id: uuidv4(), // Use uuidv4 to generate a unique ID for each choice
            choice: choice.choice,
            isCorrect: choice.isCorrect,
            questionId: question.id,
          })),
        })),
      ],
    })),

  reset: () => set(() => ({ name: "", description: "", questions: [] })),

  setselectedChoices: (selectedChoices: Choice[]) =>
    set((state) => ({
      ...state,
      selectedChoices: [...state.selectedChoices, ...selectedChoices],
    })),
}));

export default useQuizStore;
