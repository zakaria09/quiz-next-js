'use client';
import {useState} from 'react';
import CreateQuiz from '../components/CreateQuiz/CreateQuiz';
import QuizIntro from '../components/CreateQuiz/QuizIntro/QuizIntro';
import {MultipleChoiceQuestion} from '../components/CreateQuiz/shared/types/types';
// import axios from 'axios';
// import {useRouter} from 'next/navigation';
// import {useMutation} from '@tanstack/react-query';
import {addQuiz} from '@/actions/actions';
import Stepper from '@/app/components/Stepper/Stepper';

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
  // const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [quiz, setQuiz] = useState<{
    name: string;
    description: string;
  }>({name: '', description: ''});
  const [questions, setQuestions] = useState<MultipleChoiceQuestion[]>([]);

  /*
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
  */

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
    // mutation.mutate(payload);
    addQuiz(payload);
  };
  return (
    <div className="mt-8">
      <Stepper
        steps={steps}
        currentStep={currentStep}
        components={[
          <QuizIntro key={1} onCompleteEmit={handleIntro} />,
          <CreateQuiz
            key={2}
            questions={questions}
            setQuestions={setQuestions}
            onFinish={handleFinish}
            isLoading={loading}
          />,
        ]}
      />
    </div>
  );
}

export default CreateQuizPage;
