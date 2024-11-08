'use client';
import {alphabet} from '@/app/components/CreateQuiz/shared/constants/constants';
import {Card, CardContent, CardHeader} from '@/components/ui/card';
import classNames from 'classnames';
import React, {useState} from 'react';

interface choiceAnswers {
  id: string | number;
  choice: string;
  choiceId?: number;
}

export interface MultipleChoice {
  id?: number;
  question: string;
  quizId?: number;
  answers: choiceAnswers[];
}

function MultipleChoice({questions}: {questions: MultipleChoice[]}) {
  console.log(questions);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<
    choiceAnswers | undefined
  >();
  const {question, answers} = questions[currentIndex];
  const handleSelectedChoice = (choice: choiceAnswers) => {
    console.log(choice);
    setSelectedAnswer(choice);
  };

  const renderChoices = (answer: choiceAnswers, index: number) => {
    return (
      <div key={answer.id} className='block group'>
        <button
          onClick={() => handleSelectedChoice(answer)}
          className={classNames(
            'option border-2 border-gray-300 rounded-lg p-4 cursor-pointer group-hover:border-indigo-600 transition-colors text-left w-full',
            selectedAnswer?.id === answer.id
              ? 'border-indigo-600 bg-indigo-100'
              : ''
          )}
        >
          <p>
            {alphabet[index]} {') '}
            <span
              className={classNames(
                'text-gray-700 group-hover:text-indigo-700',
                selectedAnswer?.id === answer.id
                  ? 'text-slate-950 group-hover:text-slate-950'
                  : ''
              )}
            >
              {answer.choice}
            </span>
          </p>
        </button>
      </div>
    );
  };

  return (
    <div className='pt-8'>
      <Card>
        <CardHeader className='text-lg'>{question}</CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {answers.map((answer, index) => renderChoices(answer, index))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default MultipleChoice;
