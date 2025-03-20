'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import React, {useEffect, useState} from 'react';
import {useMutation, useQuery} from '@tanstack/react-query';
import axios from 'axios';
import MoonLoader from 'react-spinners/MoonLoader';
import ShowAnswer from '../../../../components/ShowAnswer/ShowAnswer';
import {Quiz} from '@/app/types/quiz';
import {choiceAnswers} from '@/app/components/CreateQuiz/shared/types/types';
import ChoiceOptions from '@/app/components/ChoiceOptions/ChoiceOptions';
import useQuizStore from '@/store/quizStore';
import {redirect, usePathname, useRouter} from 'next/navigation';
import {useSearchParams} from 'next/navigation';

export interface Choices {
  id: string;
  choice: string;
  questionId: number;
  isCorrect: boolean;
}

export interface MultipleChoice {
  id: number;
  question: string;
  quizId?: number;
  answers: Choices[];
  numOfCorrectAnswers: number;
}

type ApiResponse = {
  answers: Choices[];
  status: number;
};

type CurrentQuestionApi = {
  selectedChoices: null | Choices[];
};

function MultipleChoice({quiz}: {quiz: Quiz}) {
  const searchParams = useSearchParams();
  const {replace} = useRouter();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams);
  const quizResultId = searchParams.get('quizResultId');
  const currentQuestionIndex = searchParams.get('question');
  const currentIndex = Number(currentQuestionIndex || '0');
  // const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Choices[]>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const setSelectedChoices = useQuizStore((store) => store.setselectedChoices);

  /***
   * See if teh user has already answered a quiz question
   * ***/
  const {data: currentQuestion, isLoading: loadingCurrentQuestion} =
    useQuery<CurrentQuestionApi>({
      queryKey: ['currentQuestionIndex', currentQuestionIndex],
      queryFn: async () =>
        (
          await axios.get(
            `/api/current-question?quizResultId=${quizResultId}&questionId=${quiz.questions[currentIndex].id}`
          )
        )?.data,
      enabled: !!quizResultId, // Only run if quizResultId is available
      refetchOnWindowFocus: false, // Disable refetch on window focus
      retry: 3,
    });

  useEffect(() => {
    setSelectedAnswers(currentQuestion?.selectedChoices || []);
    setIsSubmitted(!!currentQuestion?.selectedChoices ? true : false);
  }, [currentQuestion, loadingCurrentQuestion]);

  const mutation = useMutation<ApiResponse>({
    mutationFn: async () =>
      axios.post(`/api/answers`, {
        questionId: quiz.questions[currentIndex].id,
        selectedChoice: selectedAnswers.map((choice) => choice.id),
        quizResultId,
      }),
  });

  if (currentIndex === quiz.questions.length)
    redirect(`/quiz-result/${quiz.id}?quizResultId=${quizResultId}`);

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
      mutation.mutate();
    } else {
      // setCurrentIndex((prev) => prev + 1);
      params.set('question', String(currentIndex + 1));
      replace(`${pathname}?${params.toString()}`);
      setSelectedChoices(selectedAnswers);
      setSelectedAnswers([]);
      setIsSubmitted(false);
    }
  };

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
              : answers.map((answer: choiceAnswers, index: number) => (
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
              {!mutation.isPending ? (
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
