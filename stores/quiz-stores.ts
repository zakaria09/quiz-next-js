import {createStore} from 'zustand';

interface Choices {
  id: string | number;
  choice: string;
  choiceId?: number;
}

interface choiceAnswers {
  id: string | number;
  choice: string;
  isCorrect?: boolean;
  choiceId?: number;
}

export interface MultipleChoiceQuestion {
  id?: number;
  question: string;
  quizId?: number;
  answers: choiceAnswers[];
  numOfCorrectAnswers: number;
}

export type QuizStore = QuizState & QuizActions;

export type QuizState = {
  quizId: number | null;
  questions: MultipleChoiceQuestion[];
  selectedChoices: Choices[];
};

export type QuizActions = {
  setQuizId: (quizId: number) => void;
  setQuestions: (question: MultipleChoiceQuestion[]) => void;
  setselectedChoices: (selectedChoices: Choices[]) => void;
};

export const defaultInitialState: QuizState = {
  quizId: null,
  questions: [],
  selectedChoices: [],
};

export const createQuizStore = (initState: QuizState = defaultInitialState) =>
  createStore<QuizStore>((set) => ({
    ...initState,
    quizId: null,
    selectedChoices: [],
    questions: [],
    setQuizId: (quizId: number) => set({quizId}),
    setQuestions: (questions: MultipleChoiceQuestion[]) => set({questions}),
    setselectedChoices: (selectedChoices: Choices[]) =>
      set((state) => ({
        ...state,
        selectedChoices: [...state.selectedChoices, ...selectedChoices],
      })),
  }));
