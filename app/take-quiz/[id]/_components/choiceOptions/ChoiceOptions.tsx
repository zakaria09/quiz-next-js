import React from 'react';
import {choiceAnswers} from '../MultipleChoice';
import classNames from 'classnames';
import {alphabet} from '@/app/components/CreateQuiz/shared/constants/constants';

function ChoiceOptions({
  answer,
  selectedChoice,
  index,
  onSelectedChoice,
}: {
  answer: choiceAnswers;
  selectedChoice?: choiceAnswers;
  index: number;
  onSelectedChoice: (choice: choiceAnswers) => void;
}) {
  return (
    <div key={answer.id} className='block group'>
      <button
        onClick={() => onSelectedChoice(answer)}
        className={classNames(
          'option border-2 border-gray-300 rounded-lg p-4 cursor-pointer group-hover:border-indigo-600 transition-colors text-left w-full',
          selectedChoice?.id === answer.id
            ? 'border-indigo-600 bg-indigo-100'
            : ''
        )}
      >
        <p>
          {alphabet[index]} {') '}
          <span
            className={classNames(
              'text-gray-700 group-hover:text-indigo-700',
              selectedChoice?.id === answer.id
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

export default ChoiceOptions;