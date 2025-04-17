export interface choiceAnswers {
  id: string;
  choice: string;
  isCorrect: boolean;
  questionId?: number; // Updated to string to match UUID format
}

export interface MultipleChoiceQuestion {
  id?: string; // Updated to string to match UUID format
  question: string;
  quizId?: number;
  choices: choiceAnswers[];
}
