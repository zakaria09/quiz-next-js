import { prisma } from "@/lib/prisma";
import { getUserSession } from "@/lib/session";
import { console } from "inspector";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const quizResultId = url.searchParams.get("quizResultId");
  if (!quizResultId) {
    return new NextResponse(
      JSON.stringify({ message: "Quiz Result ID is required" }),
      {
        status: 400,
      }
    );
  }

  try {
    await prisma.quizResult.update({
      where: {
        id: quizResultId,
      },
      data: {
        isCompleted: true,
      },
    });

    const quizResult = await prisma.quizResult.findUnique({
      where: {
        id: quizResultId,
      },
      include: {
        explanation: true,
        quiz: {
          include: {
            questions: {
              include: {
                choices: true,
              },
            },
          },
        },
      },
    });

    console.log("Quiz Result:", quizResult);

    if (!quizResult)
      return NextResponse.json({ quiz: null, status: 200 }, { status: 200 });

    const selectedChoices = await prisma.answer.findMany({
      where: {
        quizResultId,
      },
      select: {
        choices: {
          include: {
            answer: true,
          },
        },
      },
    });

    const formattedQuizQuestions = quizResult.quiz.questions.map((question) => {
      const selected = selectedChoices.flatMap(
        (choice) =>
          choice.choices
            .map((selected) =>
              selected.answer.questionId === question.id
                ? {
                    id: selected.choiceId,
                    questionId: selected.answer.questionId,
                  }
                : null
            )
            .filter(Boolean) // Remove null values
      );

      const explanation = quizResult.explanation.find(
        (exp) => exp.questionId === question.id
      );

      return {
        ...question,
        selected,
        explanation: explanation?.explanation ?? null,
        isCorrect: explanation?.isCorrect ?? null,
      };
    });

    return NextResponse.json(
      {
        name: quizResult.quiz.name,
        description: quizResult.quiz.description,
        quiz: formattedQuizQuestions,
        score: quizResult.score,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error, message: "Failed to fetch answers" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const { quizId } = await req.json();
  const session = await getUserSession();
  if (!session) {
    return Response.json({ message: "Unauthorized", status: 401 });
  }
  try {
    const quizCheck = await prisma.quizResult.findFirst({
      where: {
        quizId,
        isCompleted: false,
      },
    });

    if (!quizCheck) {
      const quizResult = await prisma.quizResult.create({
        data: {
          userId: session?.id,
          quizId,
          score: 0,
        },
      });
      return NextResponse.json(
        {
          quizResultId: quizResult.id,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          quizResultId: quizCheck.id,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error, message: `Failed ${error}` },
      { status: 500 }
    );
  }
}
