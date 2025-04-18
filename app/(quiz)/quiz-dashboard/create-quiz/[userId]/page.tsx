"use client";
import { useState } from "react";
import CreateQuiz from "@/app/components/CreateQuiz/CreateQuiz";
import QuizIntro from "@/app/components/CreateQuiz/QuizIntro/QuizIntro";
import { addQuiz } from "@/actions/actions";
import Stepper from "@/app/components/Stepper/Stepper";
import useQuizStore from "@/store/quizStore";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

const steps = [
  {
    id: "Step 1",
    name: "Quiz Information",
  },
  {
    id: "Step 2",
    name: "Questions",
  },
];

function CreateQuizPage() {
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { name, description, questions, reset } = useQuizStore();
  const { status } = useSession();
  const userId = params.userId;

  const handleIntro = () => {
    setCurrentStep((currentStep) => currentStep + 1);
  };

  const handleFinish = () => {
    setLoading(true);
    const payload = {
      name,
      description,
      createdBy: { connect: { id: userId } },
      questions: {
        create: questions.map((question) => {
          return {
            question: question.question,
            choices: {
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
    console.log(payload);
    addQuiz(payload);
    reset();
  };

  if (status === "unauthenticated") return <div>Unauthorized</div>;

  return (
    <div className="mt-8">
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
