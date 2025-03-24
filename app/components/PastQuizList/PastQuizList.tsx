import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {Card} from '@/components/ui/card';
import Link from 'next/link';
import React from 'react';

type resultsData = {
  quizResultId: string;
  correctTotal: number;
  incorrectTotal: number;
  totalQuestions: number;
};

export default function PastQuizList({data}: {data: resultsData[]}) {
  return (
    <div className='space-y-4'>
      {data.map((quiz, index) => (
        <Card className=' px-6 py-8' key={index}>
          <Accordion type='multiple'>
            <AccordionItem value={index.toString()} key={index}>
              <AccordionTrigger>
                <p className='font-medium text-lg'>
                  Attempt #{index + 1}:{' '}
                  <span className='text-xl font-semibold'>
                    {Math.round(
                      (quiz.correctTotal / quiz.totalQuestions) * 100
                    )}
                    %
                  </span>
                </p>
              </AccordionTrigger>
              <AccordionContent>
                <div className='py-4'>
                  <Link
                    href={`/quiz-result/1?quizResultId=${quiz.quizResultId}`}
                    className='btn-primary-lg'
                  >
                    View Detailed Breakdown
                  </Link>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      ))}
    </div>
  );
}
