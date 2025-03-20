import {Quiz} from './quiz';

interface SelectedChoice {
  choiceId: number;
  questionId: number;
  isCorrect: boolean;
}

export interface QuizResult {
  id: number;
  userId: number;
  quizId: number;
  score: number;
  isCompleted: boolean;
  answers: Answer[];
}

interface Answer {
  id: number;
  isCorrect: boolean;
  quizResultId: number;
  questionId: number;
  choices: SelectedChoice[];
  question: Quiz;
}
