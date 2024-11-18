'use client';
import {Answer, Quiz} from '@/app/types/quiz';
import {useQuizStore} from '@/util/quiz-store-provider';
import {useQuery} from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';

interface SelectedChoices {
  id: number;
  choice: Answer[];
  correct: boolean;
}

function QuizResult({quizId}: {quizId: number}) {
  const {data, isLoading} = useQuery({
    queryKey: ['questions', quizId],
    queryFn: async () =>
      (await axios.get<Quiz>(`/api/multiple-choice?quizId=${quizId}`))?.data,
  });

  const selectedChoices = useQuizStore((store) => store.selectedChoices);

  console.log(data);

  if (isLoading) return <div>Loading...</div>;

  const getResults = () => {
    const choices: SelectedChoices[] = [];
    data?.questions.reduce((acc, questions) => {
      const filteredChoices = selectedChoices.filter(
        (choice) => choice.choiceId === questions.id
      );
      choices.push({
        id: questions.id,
        choice: filteredChoices,
        correct: filteredChoices.every((choice) => choice.isCorrect),
      });
      return acc;
    }, 0);
    return choices;
  };
  console.log(getResults());
  return (
    <div>
      <h1>Results</h1>
    </div>
  );
}

export default QuizResult;
