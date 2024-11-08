import {prisma} from '@/lib/prisma';
import React from 'react';
import MultipleChoice from './_components/MultipleChoice';

export default async function TakeQuizPage({
  params,
}: {
  params: Promise<{id: string}>;
}) {
  const param = await params;
  const id = parseInt(param.id);
  const questions = await prisma.question.findMany({
    where: {
      quizId: id,
    },
    include: {
      answers: {
        select: {
          id: true,
          choice: true,
          choiceId: true,
        },
      },
    },
  });
  return <MultipleChoice questions={questions} />;
}
