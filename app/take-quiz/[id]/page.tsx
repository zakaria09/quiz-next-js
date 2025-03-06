import React from 'react';
import MultipleChoice from './_components/MultipleChoice';
import {prisma} from '@/lib/prisma';

export default async function TakeQuizPage({
  params,
}: {
  params: Promise<{id: string}>;
}) {
  const param = await params;
  const id = param.id;
  const quiz = await prisma.quiz.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      questions: {
        include: {
          answers: true,
        },
      },
    },
  });

  const questionsFormated = quiz?.questions.map((question) => {
    const numOfCorrectAnswers = question.answers.filter(
      (choice) => choice.isCorrect
    ).length;
    const removeIsCorrect = question.answers.map((answer) => ({
      id: answer.id,
      choice: answer.choice,
      choiceId: answer.choiceId,
      isCorrect: answer.isCorrect,
    }));
    return {...question, answers: removeIsCorrect, numOfCorrectAnswers};
  });
  if (!questionsFormated) return null;
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <MultipleChoice quiz={{...quiz, questions: questionsFormated} as any} />
  );
}
