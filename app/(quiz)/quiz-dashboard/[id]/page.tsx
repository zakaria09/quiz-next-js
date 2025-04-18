import QuestionList from "@/app/components/CreateQuiz/QuestionList/QuestionList";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import React from "react";
// import {MdEdit} from 'react-icons/md';
import { TbReport } from "react-icons/tb";
import Link from "next/link";
import DeleteBtn from "@/app/(quiz)/quiz-dashboard/_components/DeleteBtn/DeleteBtn";
import PastQuizList from "@/app/components/PastQuizList/PastQuizList";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const param = await params;
  const id = parseInt(param.id);
  const quiz = await prisma.quiz.findUnique({
    where: {
      id,
    },
  });
  const questions = await prisma.question.findMany({
    where: {
      quizId: id,
    },
    include: {
      choices: true,
    },
  });
  const quizResults = await prisma.quizResult.findMany({
    where: {
      quizId: id,
      isCompleted: true,
    },
    include: {
      quiz: {
        include: {
          questions: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const resultsOverview = quizResults.map((quiz) => ({
    quizId: id,
    quizResultId: quiz.id,
    correctTotal: quiz.score,
    incorrectTotal: quiz.quiz.questions.length - quiz.score,
    totalQuestions: quiz.quiz.questions.length,
  }));

  return (
    <div className="py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{quiz?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600">{quiz?.description}</p>
        </CardContent>
        <CardFooter>
          <div className="flex gap-4">
            <Link
              href={`/quiz-intro/${quiz?.id}`}
              className="btn-primary flex gap-1 self-center "
            >
              <TbReport className="text-lg self-center" />
              Start Quiz
            </Link>
            {/* <button className='btn-outline secondary flex gap-1'>
              <MdEdit className='self-center text-lg' />
              Edit
            </button> */}
            <DeleteBtn />
          </div>
        </CardFooter>
      </Card>
      <div className="py-8">
        <QuestionList
          questions={questions.map((question) => ({
            ...question,
            id: question.id.toString(),
          }))}
        />
      </div>
      <PastQuizList data={resultsOverview} />
    </div>
  );
}
