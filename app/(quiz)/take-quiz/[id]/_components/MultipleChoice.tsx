"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import MoonLoader from "react-spinners/MoonLoader";
import ShowAnswer from "../../../../components/ShowAnswer/ShowAnswer";
import { Quiz } from "@/app/types/quiz";
import { choiceAnswers } from "@/app/components/CreateQuiz/shared/types/types";
import ChoiceOptions from "@/app/components/ChoiceOptions/ChoiceOptions";
import useQuizStore from "@/store/quizStore";
import { redirect, usePathname, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import classNames from "classnames";

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

function MultipleChoice({ quiz }: { quiz: Quiz }) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams);
  const quizResultId = searchParams.get("quizResultId");
  const currentQuestionIndex = searchParams.get("question");
  const currentIndex = Number(currentQuestionIndex || "0");
  const [selectedAnswers, setSelectedAnswers] = useState<Choices[]>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [explanation, setExplanation] = useState<string>("");

  const setSelectedChoices = useQuizStore((store) => store.setselectedChoices);

  if (currentIndex === quiz.questions.length)
    redirect(`/quiz-result/${quiz.id}?quizResultId=${quizResultId}`);

  const { question, answers, numOfCorrectAnswers } =
    quiz.questions[currentIndex];

  /***
   * See if the user has already answered a quiz question
   * ***/
  const { data: currentQuestion, isLoading: loadingCurrentQuestion } =
    useQuery<CurrentQuestionApi>({
      queryKey: ["currentQuestionIndex", currentQuestionIndex],
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
    onSuccess: async () => {
      await generateExplainationMutation.mutateAsync();
    },
  });

  const generateExplainationMutation = useMutation<{ explanation: string }>({
    mutationFn: async () => {
      const { question, id } = quiz.questions[currentIndex];
      return (
        await axios.post(`/api/explanation-ai`, {
          question,
          selectedChoice: selectedAnswers
            .map((choice) => choice.choice)
            .join(","),
          isCorrect: selectedAnswers.every((choice) => choice.isCorrect),
          quizResultId,
          questionId: id,
        })
      )?.data;
    },
    onSuccess: (data) => {
      setExplanation(data.explanation);
    },
  });

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

  const handleSubmit = async () => {
    if (selectedAnswers.length === 0) return;
    if (!isSubmitted) {
      setIsSubmitted(true);
      mutation.mutate();
    } else {
      params.set("question", String(currentIndex + 1));
      replace(`${pathname}?${params.toString()}`);
      setSelectedChoices(
        selectedAnswers.map((answer) => ({
          ...answer,
          questionId: Math.floor(100000 + Math.random() * 900000),
        }))
      );
      setSelectedAnswers([]);
      setIsSubmitted(false);
      setExplanation("");
    }
  };

  return (
    <div className="pt-8">
      <div className="mb-8 flex justify-center">
        <Card className="max-w-xl">
          <CardHeader className="text-sm">
            <p className="pb-1 text-slate-600">
              Question {currentIndex + 1} of {quiz.questions.length}
            </p>
            <Progress
              value={((currentIndex + 1) / quiz.questions.length) * 100}
              max={quiz.questions.length}
            />
          </CardHeader>
        </Card>
      </div>
      <Card>
        <CardHeader className="text-lg">
          {question}
          {numOfCorrectAnswers > 1 && (
            <CardDescription className="font-semibold">
              Select at least {numOfCorrectAnswers}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
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
          {explanation && (
            <div
              className={classNames(`mt-4 px-6 py-4 rounded-md text-lg`, {
                "bg-green-100 border-green-600 border-2": selectedAnswers.every(
                  (choice) => choice.isCorrect
                ),
                "bg-red-100 border-red-600 border-2": !selectedAnswers.every(
                  (choice) => choice.isCorrect
                ),
              })}
            >
              {explanation}
            </div>
          )}
        </CardContent>
        <CardFooter>
          {selectedAnswers && (
            <div className="flex justify-start">
              {!mutation.isPending ? (
                <button className="btn-primary" onClick={handleSubmit}>
                  {isSubmitted ? "Next" : "Submit"}
                </button>
              ) : (
                <MoonLoader size={30} aria-label="Loading Spinner" />
              )}
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

export default MultipleChoice;
