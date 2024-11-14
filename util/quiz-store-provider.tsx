'use client';

import {createQuizStore, QuizStore} from '@/stores/quiz-stores';
import {type ReactNode, createContext, useRef, useContext} from 'react';
import {useStore} from 'zustand';

export type QuizStoreApi = ReturnType<typeof createQuizStore>;

export const QuizStoreContext = createContext<QuizStoreApi | undefined>(
  undefined
);

export interface CounterStoreProviderProps {
  children: ReactNode;
}

export const QuizStoreProvider = ({children}: CounterStoreProviderProps) => {
  const storeRef = useRef<QuizStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createQuizStore();
  }

  return (
    <QuizStoreContext.Provider value={storeRef.current}>
      {children}
    </QuizStoreContext.Provider>
  );
};

export const useQuizStore = <T,>(selector: (store: QuizStore) => T): T => {
  const quizStoreContext = useContext(QuizStoreContext);

  if (!quizStoreContext) {
    throw new Error(`useCounterStore must be used within CounterStoreProvider`);
  }

  return useStore(quizStoreContext, selector);
};
