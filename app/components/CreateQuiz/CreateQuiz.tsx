'use client';
import React, {useState} from 'react';
import MultipleChoiceForm from './MultipleChoiceForm/MultipleChoiceForm';
import QuestionList from './QuestionList/QuestionList';
import {MultipleChoiceQuestion} from './shared/types/types';

function CreateQuiz() {
  const [questions, setQuestions] = useState<MultipleChoiceQuestion[]>([]);

  const handleQuestionAdded = (value: MultipleChoiceQuestion) => {
    setQuestions([...questions, value]);
  };
  return (
    <div>
      <MultipleChoiceForm onMultipleChoiceEmit={handleQuestionAdded} />
      {questions.length > 0 && <QuestionList questions={questions} />}
    </div>
  );
}

export default CreateQuiz;
