import QuestionList from '@/app/components/CreateQuiz/QuestionList/QuestionList';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {prisma} from '@/lib/prisma';
import React from 'react';

export default async function page({params}: {params: Promise<{id: string}>}) {
  const param = await params;
  const id = parseInt(param.id);
  const quiz = await prisma.quiz.findUnique({
    where: {
      id,
    },
  });
  const questions = await prisma.question.findMany({
    where: {
      quizId: id,
    },
    include: {
      answers: true,
    },
  });
  return (
    <div className='py-8'>
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl font-bold'>{quiz?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-slate-600'>{quiz?.description}</p>
        </CardContent>
      </Card>
      <div className='pt-8'>
        <QuestionList questions={questions} />
      </div>
    </div>
  );
}
