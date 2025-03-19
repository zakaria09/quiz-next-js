'use client';
import {Answer, Quiz} from '@/app/types/quiz';
import {Card, CardContent, CardHeader} from '@/components/ui/card';
import {useQuery} from '@tanstack/react-query';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {Doughnut} from 'react-chartjs-2';
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import ShowAnswer from '@/app/components/ShowAnswer/ShowAnswer';
import useQuizStore from '@/store/quizStore';

ChartJS.register(ArcElement, Tooltip, Legend);
interface SelectedChoices {
  id: number;
  selected: Answer[];
  correct: boolean;
  question: string;
  choices: Answer[];
}

function QuizResult({quizId}: {quizId: number}) {
  const [choices, setChoices] = useState<SelectedChoices[]>([]);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const {data, isLoading} = useQuery({
    queryKey: ['questions', quizId],
    queryFn: async () =>
      (await axios.get<Quiz>(`/api/multiple-choice?quizId=${quizId}`))?.data,
  });

  const selectedChoices = useQuizStore((store) => store.selectedChoices);

  console.log('data', data);
  console.log('selectedChoices - - ->', selectedChoices);

  useEffect(() => {
    if (data) {
      const choices: SelectedChoices[] = [];
      data?.questions.reduce((acc, questions) => {
        const filteredChoices = selectedChoices.filter(
          (choice) => choice.questionId === questions.id
        );
        choices.push({
          id: questions.id,
          selected: filteredChoices,
          correct: filteredChoices.every((choice) => choice.isCorrect),
          question: questions.question,
          choices: questions.answers,
        });
        return acc;
      }, 0);
      setChoices(choices);
      const correctCount = choices.filter(
        (choice) => choice.correct === true
      ).length;
      const incorrectCount = choices.filter(
        (choice) => choice.correct !== true
      ).length;
      setCorrect(correctCount);
      setIncorrect(incorrectCount);
    }
  }, [data, selectedChoices]);

  if (isLoading) return <div>Loading...</div>;

  const chartData = {
    labels: ['Correct', 'Incorrect'],
    datasets: [
      {
        data: [
          (correct / choices.length) * 100,
          (incorrect / choices.length) * 100,
        ],
        backgroundColor: ['#4caf50', '#f44336'],
        hoverBackgroundColor: ['#4caf50', '#f44336'],
        borderWidth: 1,
      },
    ],
  };

  const chartConfig = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <div className='mt-8'>
      <Card>
        <CardHeader>
          <h1 className='text-2xl font-bold'>{data?.name}</h1>
          <h2 className='text-lg text-gray-600'>
            {data ? data.description : 'Name not found.'}
          </h2>
          <span className='flex gap-2'>
            <h1 className='text-2xl font-extrabold'>
              {(correct / choices.length) * 100}%
            </h1>
            <p className='text-md self-end'>
              Correct ({`${correct}/${choices.length}`})
            </p>
          </span>
        </CardHeader>
        <CardContent>
          <div className='max-h-72'>
            <Doughnut data={chartData} options={chartConfig} />
          </div>
        </CardContent>
      </Card>
      <div>
        {choices.map((choice, index) => (
          <Card key={choice.id} className='mt-4'>
            <CardHeader>
              <h1 className='text-xl font-semibold'>{choice.question}</h1>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {choice.choices.map((answer) => (
                  <ShowAnswer
                    key={answer.id}
                    selectedChoices={choice.selected}
                    answers={answer}
                    index={index}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default QuizResult;
