import {Card} from '@/components/ui/card';
import {prisma} from '@/lib/prisma';
import Link from 'next/link';
import React from 'react';

export default async function QuizDashboard() {
  const quizzes = await prisma.quiz.findMany();
  return (
    <div>
      <h1 className='text-xl font-semibold my-6'>Quiz Dashboard</h1>
      <div className='flex gap-6 '>
        {quizzes.map((quiz) => (
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
        ))}
      </div>
    </div>
  );
}
