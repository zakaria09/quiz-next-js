import {Card} from '@/components/ui/card';
import {prisma} from '@/lib/prisma';
import {getUserSession} from '@/lib/session';
import Link from 'next/link';
import React from 'react';

export default async function QuizDashboard() {
  const session = await getUserSession();

  if (!session) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <h1 className='text-2xl font-semibold'>Please login to continue</h1>
      </div>
    );
  }

  const quizzes = await prisma.quiz.findMany({
    where: {
      createdById: session.id,
    },
  });
  return (
    <div className='py-6'>
      <div className='flex w-full justify-between pb-8 px-4 md:px-0'>
        <h1 className='text-xl font-semibold self-center'>Quiz Dashboard</h1>
        <Link className='btn-primary-lg' href={'/quiz-dashboard/create-quiz'}>
          Create a Quiz
        </Link>
      </div>
      <div className='flex flex-col gap-6 '>
        {quizzes.length > 0 ? (
          quizzes.map((quiz) => (
            <Link
              key={quiz.id}
              href={`/quiz-dashboard/${quiz.id}`}
              className='group'
            >
              <Card className='mt-4 py-6 px-12'>
                <h2 className='text-2xl font-bold group-hover:text-indigo-500 group-hover:underline'>
                  {quiz.name}
                </h2>
                <p className='text-gray-500'>{quiz.description}</p>
              </Card>
            </Link>
          ))
        ) : (
          <p className='text-gray-600 '>No quizzes added yet!</p>
        )}
      </div>
    </div>
  );
}
