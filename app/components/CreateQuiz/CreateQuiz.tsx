'use client';
import React from 'react';
import MultipleChoiceForm from './MultipleChoiceForm/MultipleChoiceForm';
import QuestionList from './QuestionList/QuestionList';
import {MultipleChoiceQuestion} from './shared/types/types';

function CreateQuiz({
  questions,
  setQuestions,
  onFinish,
}: {
  questions: MultipleChoiceQuestion[];
  setQuestions: (value: MultipleChoiceQuestion[]) => void;
  onFinish: (questions: MultipleChoiceQuestion[]) => void;
}) {
  const handleQuestionAdded = (value: MultipleChoiceQuestion) => {
    setQuestions([...questions, value]);
  };
  return (
    <div>
      <MultipleChoiceForm onMultipleChoiceEmit={handleQuestionAdded} />
      {questions.length > 0 && (
        <QuestionList questions={questions} onFinish={onFinish} />
      )}
    </div>
  );
}

export default CreateQuiz;
