export interface choiceAnswers {
  id: string | number;
  choice: string;
  isCorrect: boolean;
  choiceId?: number;
}

export interface MultipleChoiceQuestion {
  id?: number;
  question: string;
  quizId?: number;
  choices: choiceAnswers[];
}
