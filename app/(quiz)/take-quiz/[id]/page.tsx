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
          choices: true,
        },
      },
    },
  });

  const questionsFormated = quiz?.questions.map((question) => {
    const numOfCorrectAnswers = question.choices.filter(
      (choice) => choice.isCorrect
    ).length;
    const removeIsCorrect = question.choices.map((choice) => ({
      id: choice.id,
      choice: choice.choice,
      questionId: choice.questionId,
      isCorrect: choice.isCorrect,
    }));
    return {...question, answers: removeIsCorrect, numOfCorrectAnswers};
  });
  if (!questionsFormated) return null;
  return <MultipleChoice quiz={{...quiz, questions: questionsFormated}} />;
}
