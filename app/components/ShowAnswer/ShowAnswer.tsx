import React from 'react';
import {choiceAnswers} from '@/app/components/CreateQuiz/shared/types/types';
import classNames from 'classnames';
import {alphabet} from '@/app/components/CreateQuiz/shared/constants/constants';

function ShowAnswer({
  answers,
  index,
  selectedChoices,
}: {
  answers: choiceAnswers;
  index: number;
  selectedChoices: Array<{id: string}>;
}) {
  return (
    <div key={answers.id} className='block'>
      <button
        className={classNames(
          'option border-2 border-gray-300 rounded-lg p-4 transition-colors text-left w-full',
          answers.isCorrect ? 'border-green-600 bg-green-100' : '',
          selectedChoices.findIndex((choice) => choice.id === answers.id) >=
            0 && !answers.isCorrect
            ? 'border-red-600 bg-red-100 font-bold'
            : ''
        )}
      >
        <p
          className={classNames(
            'text-gray-700',
            selectedChoices.findIndex((choice) => choice.id === answers.id) >= 0
              ? 'text-slate-950 group-hover:text-slate-950  font-extrabold'
              : ''
          )}
        >
          {alphabet[index]} {') '}
          <span>{answers.choice}</span>
        </p>
      </button>
    </div>
  );
}

export default ShowAnswer;
