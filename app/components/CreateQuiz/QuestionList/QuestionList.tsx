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
import {alphabet} from '../shared/constants/constants';
import {MultipleChoiceQuestion} from '../shared/types/types';

function QuestionList({
  questions,
  children,
  showAnswers = false,
}: {
  questions: MultipleChoiceQuestion[];
  children?: React.ReactNode;
  showAnswers?: boolean;
}) {
  return (
    <div>
      <Card className=' px-6 py-8'>
        <Accordion type='multiple'>
          {questions.map((question, index) => (
            <AccordionItem value={index.toString()} key={question.id}>
              <AccordionTrigger>
                <p className='font-medium text-lg'>
                  Question {index + 1}:{' '}
                  <span className='text-xl font-semibold'>
                    {question.question}
                  </span>
                </p>
              </AccordionTrigger>
              <AccordionContent>
                {question.choices.map((choice, ind) => (
                  <div key={choice.id}>
                    <div className='font-medium mb-1 flex gap-4 items-center text-lg px-2 py-1'>
                      <div className='flex items-center gap-1'>
                        <p>
                          {alphabet[ind]}
                          {') '}
                        </p>
                        <span className='font-semibold text-lg self-center'>
                          {choice.choice}
                        </span>
                      </div>
                      {showAnswers && choice.isCorrect ? (
                        <SiTicktick className='text-green-500' />
                      ) : null}
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
