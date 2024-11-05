'use client';
import {useEffect, useState} from 'react';
import CreateQuiz from '../components/CreateQuiz/CreateQuiz';
import QuizIntro from '../components/CreateQuiz/QuizIntro/QuizIntro';
import {MultipleChoiceQuestion} from '../components/CreateQuiz/shared/types/types';

const steps = [
  {
    id: 'Step 1',
    name: 'Quiz Information',
  },
  {
    id: 'Step 2',
    name: 'Questions',
  },
];

function CreateQuizPage() {
  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [quiz, setQuiz] = useState({});
  const [questions, setQuestions] = useState<MultipleChoiceQuestion[]>([]);

  useEffect(() => {
    console.log(quiz);
  }, [quiz]);

  const handleIntro = (data) => {
    const {name, description} = data;
    setQuiz({
      ...quiz,
      intro: {
        name,
        description,
      },
    });
    setPreviousStep(currentStep);
    setCurrentStep((currentStep) => currentStep + 1);
  };

  const handleFinish = (questions) => {
    setQuiz({...quiz, questions: questions});
  };
  return (
    <div>
      <div className='mt-8'>
        <nav aria-label='Progress'>
          <ol
            role='list'
            className='space-y-4 md:flex md:space-x-8 md:space-y-0'
          >
            {steps.map((step, index) => (
              <li key={step.name} className='md:flex-1'>
                {currentStep > index ? (
                  <div className='group flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'>
                    <span className='text-sm font-medium text-sky-600 transition-colors '>
                      {step.id}
                    </span>
                    <span className='text-sm font-medium'>{step.name}</span>
                  </div>
                ) : currentStep === index ? (
                  <div
                    className='flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'
                    aria-current='step'
                  >
                    <span className='text-sm font-medium text-sky-600'>
                      {step.id}
                    </span>
                    <span className='text-sm font-medium'>{step.name}</span>
                  </div>
                ) : (
                  <div className='group flex w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'>
                    <span className='text-sm font-medium text-gray-500 transition-colors'>
                      {step.id}
                    </span>
                    <span className='text-sm font-medium'>{step.name}</span>
                  </div>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
      {currentStep === 0 && <QuizIntro onCompleteEmit={handleIntro} />}
      {currentStep === 1 && (
        <CreateQuiz
          questions={questions}
          setQuestions={setQuestions}
          onFinish={handleFinish}
        />
      )}
    </div>
  );
}

export default CreateQuizPage;
