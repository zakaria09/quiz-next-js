'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import React, {useState} from 'react';
import ChoiceOptions from './ChoiceOptions/ChoiceOptions';
import {useQuery} from '@tanstack/react-query';
import axios from 'axios';
import MoonLoader from 'react-spinners/MoonLoader';
import ShowAnswer from './ShowAnswer/ShowAnswer';
import {useQuizStore} from '@/util/quiz-store-provider';
import QuizResult from './QuizResult/QuizResult';
import {Quiz} from '@/app/types/quiz';
import {choiceAnswers} from '@/app/components/CreateQuiz/shared/types/types';
export interface Choices {
  id: number;
  choice: string;
  choiceId: number;
  isCorrect: boolean;
}

export interface MultipleChoice {
  id?: number;
  question: string;
  quizId?: number;
  answers: Choices[];
  numOfCorrectAnswers: number;
}

function MultipleChoice({quiz}: {quiz: Quiz}) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Choices[]>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  console.log(quiz);

  const selectedChoices = useQuizStore((store) => store.selectedChoices);
  const setSelectedChoices = useQuizStore((store) => store.setselectedChoices);

  console.log('selectedChoices state', selectedChoices);

  const {data, refetch, isLoading} = useQuery({
    queryKey: ['answers', currentIndex],
    queryFn: async () =>
      (
        await axios.post(`/api/answers`, {
          quizIds: selectedAnswers?.map((answer) => answer.choiceId),
        })
      )?.data,
    enabled: false,
  });

  if (currentIndex === quiz.questions.length)
    return <QuizResult quizId={Number(quiz.id)} />;

  const {question, answers, numOfCorrectAnswers} = quiz.questions[currentIndex];
  const handleSelectedChoice = (choice: Choices) => {
    if (numOfCorrectAnswers === 1) {
      setSelectedAnswers([choice]);
      return;
    } else if (numOfCorrectAnswers > 1) {
      checkAnswerIsSelected(choice);
    }
  };

  const checkAnswerIsSelected = (choice: Choices) => {
    const isSelected =
      selectedAnswers.findIndex((answer) => answer.id === choice.id) >= 0;
    if (!isSelected && selectedAnswers.length < numOfCorrectAnswers) {
      setSelectedAnswers((prev) => [...prev, choice]);
    } else {
      setSelectedAnswers(
        selectedAnswers.filter((selected) => selected.id !== choice.id)
      );
    }
  };

  const handleSubmit = () => {
    if (!isSubmitted) {
      setIsSubmitted(true);
      refetch();
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedChoices(selectedAnswers);
      setSelectedAnswers([]);
      setIsSubmitted(false);
    }
  };

  console.log(currentIndex);

  return (
    <div className='pt-8'>
      <Card>
        <CardHeader className='text-lg'>
          {question}
          {numOfCorrectAnswers > 1 && (
            <CardDescription className='font-semibold'>
              Select at least {numOfCorrectAnswers}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {!isSubmitted
              ? answers.map((answer, index) => (
                  <ChoiceOptions
                    key={answer.id}
                    answer={answer}
                    selectedChoices={selectedAnswers}
                    index={index}
                    onSelectedChoice={handleSelectedChoice}
                  />
                ))
              : data?.answers.map((answer: choiceAnswers, index: number) => (
                  <ShowAnswer
                    key={answer.id}
                    answers={answer}
                    index={index}
                    selectedChoices={selectedAnswers}
                  />
                ))}
          </div>
        </CardContent>
        <CardFooter>
          {selectedAnswers && (
            <div className='flex justify-start'>
              {!isLoading ? (
                <button className='btn-primary' onClick={handleSubmit}>
                  {isSubmitted ? 'Next' : 'Submit'}
                </button>
              ) : (
                <MoonLoader size={30} aria-label='Loading Spinner' />
              )}
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

export default MultipleChoice;
