import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {prisma} from '@/lib/prisma';
import React from 'react';
import StartQuizBtn from '../_components/StartQuizBtn';

export default async function QuizIntroPage({
  params,
}: {
  params: Promise<{id: string}>;
}) {
  const param = await params;
  const id = parseInt(param.id);
  const quiz = await prisma.quiz.findUnique({
    where: {
      id,
    },
    include: {
      questions: {
        select: {
          id: true,
        },
      },
    },
  });
  const numberOfQuestions = await prisma.question.count({
    where: {
      quizId: id,
    },
  });
  return (
    <div className='py-8'>
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl font-bold'>{quiz?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-slate-800 text-lg'>{quiz?.description}</p>
          <p className='text-gray-500'>{numberOfQuestions} Questions</p>
        </CardContent>
        <CardFooter>
          <div className='flex gap-4'>
            <StartQuizBtn quizId={quiz?.id as number} />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
