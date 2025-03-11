export interface choiceAnswers {
  id: string | number;
  choice: string;
  isCorrect: boolean;
  questionId?: number;
}

export interface MultipleChoiceQuestion {
  id?: number;
  question: string;
  quizId?: number;
  choices: choiceAnswers[];
}
