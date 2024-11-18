export interface Quiz {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  questions: Question[];
}

interface Question {
  id: number;
  question: string;
  quizId: number;
  answers: Answer[];
  numOfCorrectAnswers: number;
}

export interface Answer {
  id: number;
  choice: string;
  choiceId: number;
  isCorrect: boolean;
}
