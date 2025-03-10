'use client';
import {useState} from 'react';
import CreateQuiz from '../components/CreateQuiz/CreateQuiz';
import QuizIntro from '../components/CreateQuiz/QuizIntro/QuizIntro';
import {addQuiz} from '@/actions/actions';
import Stepper from '@/app/components/Stepper/Stepper';
import useQuizStore from '@/store/quizStore';

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
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const {name, description, questions} = useQuizStore();

  console.log('store', name, description);

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

  const handleIntro = () => {
    setCurrentStep((currentStep) => currentStep + 1);
  };

  const handleFinish = () => {
    setLoading(true);
    const payload = {
      name,
      description,
      questions: {
        create: questions.map((question) => {
          return {
            question: question.question,
            answers: {
              create: question.choices.map((answer) => ({
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
    <div className='mt-8'>
      <Stepper
        steps={steps}
        currentStep={currentStep}
        components={[
          <QuizIntro key={1} next={handleIntro} />,
          <CreateQuiz key={2} onFinish={handleFinish} isLoading={loading} />,
        ]}
      />
    </div>
  );
}

export default CreateQuizPage;
