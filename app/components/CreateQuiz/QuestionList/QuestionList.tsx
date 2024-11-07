'use client';
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {Card} from '@/components/ui/card';
import {SiTicktick} from 'react-icons/si';
import {MultipleChoiceQuestion} from '../shared/types/types';
import {alphabet} from '../shared/constants/constants';

function QuestionList({
  questions,
  children,
}: {
  questions: MultipleChoiceQuestion[];
  children?: React.ReactNode;
}) {
  console.log(questions);
  return (
    <div className='min-h-[calc(100vh-124px)]'>
      <Card className=' px-6 py-8'>
        <Accordion type='multiple'>
          {questions.map((question, index) => (
            <AccordionItem value={index.toString()} key={index}>
              <AccordionTrigger>
                <p className='font-medium text-lg'>
                  Question {index + 1}:{' '}
                  <span className='text-xl font-semibold'>
                    {question.question}
                  </span>
                </p>
              </AccordionTrigger>
              <AccordionContent>
                {question.answers.map((answer, ind) => (
                  <div key={answer.id}>
                    <div className='font-medium mb-1 flex gap-4 items-center'>
                      <div className='flex items-center gap-1'>
                        <p>
                          {alphabet[ind]}
                          {') '}
                        </p>
                        <span className='font-semibold text-lg'>
                          {answer.choice}
                        </span>
                      </div>
                      {answer.isCorrect && (
                        <SiTicktick className='text-green-500' />
                      )}
                    </div>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        {children}
      </Card>
    </div>
  );
}

export default QuestionList;
