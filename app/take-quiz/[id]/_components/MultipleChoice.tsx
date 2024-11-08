'use client';
import {Card, CardContent, CardFooter, CardHeader} from '@/components/ui/card';
import React, {useState} from 'react';
import ChoiceOptions from './choiceOptions/ChoiceOptions';

export interface choiceAnswers {
  id: string | number;
  choice: string;
  choiceId?: number;
}

export interface MultipleChoice {
  id?: number;
  question: string;
  quizId?: number;
  answers: choiceAnswers[];
}

function MultipleChoice({questions}: {questions: MultipleChoice[]}) {
  console.log(questions);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<
    choiceAnswers | undefined
  >();
  const {question, answers} = questions[currentIndex];
  const handleSelectedChoice = (choice: choiceAnswers) => {
    console.log(choice);
    setSelectedAnswer(choice);
  };

  return (
    <div className='pt-8'>
      <Card>
        <CardHeader className='text-lg'>{question}</CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {answers.map((answer, index) => (
              <ChoiceOptions
                key={answer.id}
                answer={answer}
                selectedChoice={selectedAnswer}
                index={index}
                onSelectedChoice={handleSelectedChoice}
              />
            ))}
          </div>
        </CardContent>
        <CardFooter>
          {selectedAnswer && (
            <div className='flex justify-start'>
              <button className='btn-primary'>Submit</button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

export default MultipleChoice;
