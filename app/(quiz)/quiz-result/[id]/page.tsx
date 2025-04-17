import React from 'react';
import QuizResult from '../_components/QuizResult/QuizResult';
import {Card, CardFooter, CardHeader} from '@/components/ui/card';
import Link from 'next/link';
import {GiCycle} from 'react-icons/gi';
import {IoArrowBack} from 'react-icons/io5';

export default async function QuizResultPage({
  params,
}: {
  params: Promise<{id: string}>;
}) {
  const param = await params;
  const id = param.id;
  return (
    <>
      <Card className='mt-4'>
        <CardHeader>
          <h1 className='text-2xl font-bold mb-4'>Quiz Result</h1>
          <p className='text-gray-600 mb-8'>Here are your results:</p>
        </CardHeader>
        <CardFooter className='flex gap-4'>
          <Link
            href={`/quiz-dashboard/${id}`}
            className='btn-outline primary flex gap-1 self-center '
          >
            <IoArrowBack className='text-lg self-center' />
            Quiz Overview
          </Link>
          <Link
            href={`/quiz-intro/${id}`}
            className='btn-primary flex gap-1 self-center '
          >
            <GiCycle className='text-lg self-center' />
            Retry Quiz
          </Link>
        </CardFooter>
      </Card>
      <QuizResult quizId={Number(id)} />;
    </>
  );
}
