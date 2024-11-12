import {create} from 'zustand';

interface Choices {
  id: string | number;
  choice: string;
  choiceId?: number;
}

interface choiceAnswers {
  id: string | number;
  choice: string;
  isCorrect: boolean;
  choiceId?: number;
}

export interface MultipleChoiceQuestion {
  question: string;
  quizId?: number;
  answers: choiceAnswers[];
}

interface Quiz {
  quizId: number | null;
  questions: MultipleChoiceQuestion[];
  selectedChoices: Choices[];
}

export const useQuizStore = create<Quiz>((set) => ({
  quizId: null,
  selectedChoices: [],
  questions: [],
  setQuizId: (quizId: number) => set({quizId}),
  setQuestions: (question: MultipleChoiceQuestion[]) =>
    set((state) => ({...state, question})),
  setselectedChoices: (selectedChoices: Choices[]) =>
    set((state) => ({...state, selectedChoices})),
}));
