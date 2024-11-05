interface choiceAnswers {
  id: string;
  choice: string;
  isCorrect: boolean;
}

export interface MultipleChoiceQuestion {
  question: string;
  answers: choiceAnswers[];
}
