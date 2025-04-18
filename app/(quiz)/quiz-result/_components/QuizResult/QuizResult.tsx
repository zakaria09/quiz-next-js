"use client";
import { Choice } from "@/app/types/quiz";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ShowAnswer from "@/app/components/ShowAnswer/ShowAnswer";
import { useSearchParams } from "next/navigation";
import DoughnutChart from "@/app/components/DoughnutChart/DoughnutChart";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import classNames from "classnames";

ChartJS.register(ArcElement, Tooltip, Legend);
interface SelectedChoices {
  id: number;
  selected: Choice[];
  isCorrect: boolean;
  question: string;
  choices: Choice[];
  explanation?: string;
}

function QuizResult({ quizId }: { quizId: number }) {
  const searchParams = useSearchParams();
  const quizResultId = searchParams.get("quizResultId");
  const [choices, setChoices] = useState<SelectedChoices[]>([]);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const { data, isLoading } = useQuery({
    queryKey: ["questions", quizId],
    queryFn: async () =>
      (await axios.get(`/api/results?quizResultId=${quizResultId}`))?.data,
  });

  useEffect(() => {
    if (data) {
      const choices: SelectedChoices[] = data.quiz;

      setChoices(choices);
      setCorrect(data.score);
      setIncorrect(data.quiz.length - data.score);
    }
  }, [data]);

  if (isLoading) return <div>Loading...</div>;

  console.log(choices);

  return (
    <div className="mt-8">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">{data?.name}</h1>
          <h2 className="text-lg text-gray-600">
            {data ? data.description : "Name not found."}
          </h2>
          <span className="flex gap-2">
            <h1 className="text-2xl font-extrabold">
              {Math.round((correct / choices.length) * 100)}%
            </h1>
            <p className="text-md self-end">
              Correct ({`${correct}/${choices.length}`})
            </p>
          </span>
        </CardHeader>
        <CardContent>
          <div className="max-h-72">
            <DoughnutChart
              correct={correct}
              incorrect={incorrect}
              questionsTotal={choices.length}
            />
          </div>
        </CardContent>
      </Card>
      <div>
        {choices.map((choice) => (
          <Card key={choice.id} className="mt-4">
            <CardHeader>
              <h1 className="text-xl font-semibold">{choice.question}</h1>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {choice.choices.map((answer, index) => (
                  <ShowAnswer
                    key={answer.id}
                    selectedChoices={choice.selected}
                    answers={answer}
                    index={index}
                  />
                ))}
              </div>
              {choice.explanation && (
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Explanation</AccordionTrigger>
                    <AccordionContent>
                      <div
                        className={classNames(
                          `mt-4 px-6 py-4 rounded-md text-lg`,
                          {
                            "bg-green-100 border-green-600 border-2":
                              choice.isCorrect,
                            "bg-red-100 border-red-600 border-2":
                              !choice.isCorrect,
                          }
                        )}
                      >
                        {choice.explanation}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default QuizResult;
