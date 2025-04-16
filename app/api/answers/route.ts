import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { questionId, quizResultId, selectedChoice } = await request.json();

    if (!questionId) {
      return new NextResponse(
        JSON.stringify({ message: "Quiz ID is required" }),
        {
          status: 400,
        }
      );
    }

    const answers = await prisma.choice.findMany({
      where: {
        questionId: Number(questionId),
      },
    });

    const correctAnswers = answers.filter(
      (answer) => answer.isCorrect === true
    );

    const correctChoiceIds = correctAnswers.map((choice) => choice.id);

    const isCorrect = correctChoiceIds.every((id) =>
      selectedChoice.includes(id)
    );

    /**
     * Create the selected answers in the database
     * **/
    await prisma.answer.create({
      data: {
        isCorrect,
        quizResultId: quizResultId,
        questionId: questionId,
        choices: {
          create: selectedChoice.map((choice: string) => ({
            choiceId: choice,
          })),
        },
      },
    });

    if (isCorrect) {
      await prisma.quizResult.update({
        where: { id: quizResultId },
        data: {
          score: { increment: 1 },
        },
      });
    }

    return NextResponse.json({ answers, status: 200 }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error, message: "Failed to fetch answers" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const quizId = url.searchParams.get("quizId");
  if (!quizId) {
    return new NextResponse(
      JSON.stringify({ message: "Quiz ID is required" }),
      {
        status: 400,
      }
    );
  }

  try {
    const quizAnswers = await prisma.quiz.findUnique({
      where: {
        id: Number(quizId),
      },
      include: {
        questions: {
          include: {
            choices: true,
          },
        },
      },
    });

    return NextResponse.json(quizAnswers, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error, message: "Failed to fetch answers" },
      { status: 500 }
    );
  }
}
