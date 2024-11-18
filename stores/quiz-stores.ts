import {createStore} from 'zustand';

type Choices = {
  id: number;
  choice: string;
  choiceId: number;
  isCorrect: boolean;
};

type choiceAnswers = {
  id: number;
  choice: string;
  isCorrect?: boolean;
  choiceId: number;
};

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
  selectedChoices: Choices[];
};

export type QuizActions = {
  setQuizId: (quizId: number) => void;
  setselectedChoices: (selectedChoices: Choices[]) => void;
};

export const defaultInitialState: QuizState = {
  quizId: null,
  selectedChoices: [],
};

export const createQuizStore = (initState: QuizState = defaultInitialState) =>
  createStore<QuizStore>((set) => ({
    ...initState,
    quizId: null,
    selectedChoices: [],
    questions: [],
    setQuizId: (quizId: number) => set({quizId}),
    setselectedChoices: (selectedChoices: Choices[]) =>
      set((state) => ({
        ...state,
        selectedChoices: [...state.selectedChoices, ...selectedChoices],
      })),
  }));
