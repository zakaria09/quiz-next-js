import QuestionList from '@/app/components/CreateQuiz/QuestionList/QuestionList';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {prisma} from '@/lib/prisma';
import React from 'react';
import {MdEdit} from 'react-icons/md';
import {FaEye} from 'react-icons/fa';
import Link from 'next/link';
import DeleteBtn from '@/app/(quiz)/quiz-dashboard/_components/DeleteBtn/DeleteBtn';
import PastQuizList from '@/app/components/PastQuizList/PastQuizList';

export default async function Page({params}: {params: Promise<{id: string}>}) {
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
      choices: true,
    },
  });
  const quizResults = await prisma.quizResult.findMany({
    where: {
      quizId: id,
      isCompleted: true,
    },
    include: {
      quiz: {
        include: {
          questions: true,
        },
      },
    },
  });

  const resultsOverview = quizResults.map((quiz) => ({
    quizResultId: quiz.id,
    correctTotal: quiz.score,
    incorrectTotal: quiz.quiz.questions.length - quiz.score,
    totalQuestions: quiz.quiz.questions.length,
  }));

  /**
   * TODO: Database migration to chnage the schema from answers to choices
   * @see https://www.prisma.io/docs/concepts/components/prisma-migrate
   */
  return (
    <div className='py-8'>
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl font-bold'>{quiz?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-slate-600'>{quiz?.description}</p>
        </CardContent>
        <CardFooter>
          <div className='flex gap-4'>
            <Link
              href={`/quiz-intro/${quiz?.id}`}
              className='btn-outline primary flex gap-1'
            >
              <FaEye className='self-center text-lg' />
              Preview
            </Link>
            <button className='btn-outline secondary flex gap-1'>
              <MdEdit className='self-center text-lg' />
              Edit
            </button>
            <DeleteBtn />
          </div>
        </CardFooter>
      </Card>
      <div className='py-8'>
        <QuestionList questions={questions} />
      </div>
      <PastQuizList data={resultsOverview} />
    </div>
  );
}
