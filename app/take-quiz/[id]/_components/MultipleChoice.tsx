'use client';
import {Card, CardContent, CardFooter, CardHeader} from '@/components/ui/card';
import React, {useState} from 'react';
import ChoiceOptions from './ChoiceOptions/ChoiceOptions';
import {useQuery} from '@tanstack/react-query';
import axios from 'axios';
import MoonLoader from 'react-spinners/MoonLoader';
import ShowAnswer from './ShowAnswer/ShowAnswer';

export interface Choices {
  id: string | number;
  choice: string;
  choiceId?: number;
}

export interface MultipleChoice {
  id?: number;
  question: string;
  quizId?: number;
  answers: Choices[];
}

function MultipleChoice({questions}: {questions: MultipleChoice[]}) {
  console.log(questions);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<Choices | undefined>();
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const {data, refetch, isLoading} = useQuery({
    queryKey: ['answers', currentIndex],
    queryFn: async () =>
      (await axios.get(`/api/answers?quizId=${selectedAnswer?.choiceId}`))
        ?.data,
    enabled: false,
  });

  console.log('data ->', data);

  const {question, answers} = questions[currentIndex];
  const handleSelectedChoice = (choice: Choices) => {
    console.log(choice);
    setSelectedAnswer(choice);
  };

  const handleSubmit = () => {
    if (!isSubmitted) {
      setIsSubmitted(true);
      refetch();
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(undefined);
      setIsSubmitted(false);
    }
  };

  return (
    <div className='pt-8'>
      <Card>
        <CardHeader className='text-lg'>{question}</CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {!isSubmitted
              ? answers.map((answer, index) => (
                  <ChoiceOptions
                    key={answer.id}
                    answer={answer}
                    selectedChoice={selectedAnswer}
                    index={index}
                    onSelectedChoice={handleSelectedChoice}
                  />
                ))
              : data?.answers.map((answer, index) => (
                  <ShowAnswer
                    key={answer.id}
                    answers={answer}
                    index={index}
                    selectedChoice={selectedAnswer}
                  />
                ))}
          </div>
        </CardContent>
        <CardFooter>
          {selectedAnswer && (
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
