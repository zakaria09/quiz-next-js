'use client';
import {useState} from 'react';
import CreateQuiz from '../components/CreateQuiz/CreateQuiz';
import QuizIntro from '../components/CreateQuiz/QuizIntro/QuizIntro';
import {MultipleChoiceQuestion} from '../components/CreateQuiz/shared/types/types';
import axios from 'axios';
import {useRouter} from 'next/navigation';
import {useMutation} from '@tanstack/react-query';

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
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [quiz, setQuiz] = useState<{
    name: string;
    description: string;
  }>({name: '', description: ''});
  const [questions, setQuestions] = useState<MultipleChoiceQuestion[]>([]);

  const mutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: async (data: any) => {
      const response = await axios.post('/api/multiple-choice', data);
      return response.data;
    },
    onSuccess: () => {
      // Navigate to the quiz-dashboard on successful submission
      router.push('/quiz-dashboard');
    },
    onError: (error) => {
      console.error('Error creating quiz:', error);
      alert('Failed to create the quiz. Please try again.');
    },
  });

  const handleIntro = (data: {name: string; description: string}) => {
    const {name, description} = data;
    setQuiz((prev) => ({
      ...prev,
      name,
      description,
    }));
    setCurrentStep((currentStep) => currentStep + 1);
  };

  const handleFinish = () => {
    console.log(questions);
    setLoading(true);
    const payload = {
      ...quiz,
      questions: {
        create: questions.map((question) => {
          return {
            question: question.question,
            answers: {
              create: question.answers.map((answer) => ({
                choice: answer.choice,
                isCorrect: answer.isCorrect,
              })),
            },
          };
        }),
      },
      updatedAt: new Date(),
    };
    console.log(payload);
    mutation.mutate(payload);
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
          isLoading={loading}
        />
      )}
    </div>
  );
}

export default CreateQuizPage;
