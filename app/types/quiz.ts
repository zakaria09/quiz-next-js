export interface Quiz {
  id?: number;
  name?: string;
  description?: string;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
  questions: Question[];
}

interface Question {
  id: number;
  question: string;
  quizId: number;
  answers: Choice[];
  numOfCorrectAnswers: number;
}

export interface Choice {
  id: string;
  choice: string;
  questionId: number;
  isCorrect: boolean;
}
