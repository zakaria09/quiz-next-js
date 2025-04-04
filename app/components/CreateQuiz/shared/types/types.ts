export interface choiceAnswers {
  id: string;
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
