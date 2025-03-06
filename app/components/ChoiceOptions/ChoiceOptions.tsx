import React from 'react';
import classNames from 'classnames';
import {alphabet} from '@/app/components/CreateQuiz/shared/constants/constants';
import {Choices} from '@/app/take-quiz/[id]/_components/MultipleChoice';

export default function ChoiceOptions({
  answer,
  selectedChoices,
  index,
  onSelectedChoice,
}: {
  answer: Choices;
  selectedChoices: Choices[];
  index: number;
  onSelectedChoice: (choice: Choices) => void;
}) {
  return (
    <div key={answer.id} className='block group'>
      <button
        onClick={() => onSelectedChoice(answer)}
        className={classNames(
          'option border-2 border-gray-300 rounded-lg p-4 cursor-pointer group-hover:border-indigo-600 transition-colors text-left w-full',
          selectedChoices.findIndex((choice) => choice.id === answer.id) >= 0
            ? 'border-indigo-600 bg-indigo-100 font-bold'
            : ''
        )}
      >
        <p>
          {alphabet[index]} {') '}
          <span
            className={classNames(
              'text-gray-700 group-hover:text-indigo-700',
              selectedChoices.findIndex((choice) => choice.id === answer.id) >=
                0
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
}
