'use client';
import React from 'react';
import MultipleChoiceForm from './MultipleChoiceForm/MultipleChoiceForm';
import QuestionList from './QuestionList/QuestionList';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import useQuizStore from '@/store/quizStore';

function CreateQuiz({
  onFinish,
  isLoading,
}: {
  onFinish: () => void;
  isLoading: boolean;
}) {
  const {questions} = useQuizStore();

  const handleFinish = () => {
    onFinish();
  };

  if (isLoading) {
    return (
      <div className='flex justify-center h-72'>
        <div className='self-center'>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div>
      <MultipleChoiceForm />
      {questions.length > 0 && (
        <QuestionList>
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
