'use client';
import React from 'react';
import MultipleChoiceForm from './MultipleChoiceForm/MultipleChoiceForm';
import QuestionList from './QuestionList/QuestionList';
import {MultipleChoiceQuestion} from './shared/types/types';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

function CreateQuiz({
  questions,
  setQuestions,
  onFinish,
  isLoading,
}: {
  questions: MultipleChoiceQuestion[];
  setQuestions: (value: MultipleChoiceQuestion[]) => void;
  onFinish: (questions: MultipleChoiceQuestion[]) => void;
  isLoading: boolean;
}) {
  const handleQuestionAdded = (value: MultipleChoiceQuestion) => {
    setQuestions([...questions, value]);
  };
  const handleFinish = () => {
    onFinish(questions);
  };

  if (isLoading) {
    return (
      <div className='flex justify-center h-72'>
        <div className='self-center'>
          <LoadingSpinner size={{width: 24, height: 24}} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <MultipleChoiceForm onMultipleChoiceEmit={handleQuestionAdded} />
      {questions.length > 0 && (
        <QuestionList questions={questions}>
          <div className='flex justify-end pt-6'>
            <button
              type='button'
              className='btn-primary'
              onClick={handleFinish}
            >
              Finish Quiz
            </button>
          </div>
        </QuestionList>
      )}
    </div>
  );
}

export default CreateQuiz;
