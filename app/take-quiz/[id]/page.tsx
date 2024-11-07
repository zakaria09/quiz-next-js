import {prisma} from '@/lib/prisma';
import React from 'react';

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
    take: 1,
    skip: 1,
    cursor: {
      id: id,
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
  return <div>{JSON.stringify(questions)}</div>;
}
