import {prisma} from '@/lib/prisma';
import {NextResponse} from 'next/server';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const quizId = url.searchParams.get('quizId');
  if (!quizId) {
    return new NextResponse(JSON.stringify({message: 'Quiz ID is required'}), {
      status: 400,
    });
  }

  try {
    const quiz = await prisma.quiz.findUnique({
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

    const questionsFormated = quiz?.questions.map((question) => {
      const numOfCorrectAnswers = question.choices.filter(
        (choice) => choice.isCorrect
      ).length;
      const removeIsCorrect = question.choices.map((choice) => ({
        id: choice.id,
        choice: choice.choice,
        choiceId: choice.questionId,
        isCorrect: choice.isCorrect,
      }));
      return {...question, answers: removeIsCorrect, numOfCorrectAnswers};
    });

    return NextResponse.json(
      {...quiz, questions: questionsFormated},
      {status: 200}
    );
  } catch (error) {
    return NextResponse.json(
      {error: error, message: 'Failed to fetch answers'},
      {status: 500}
    );
  }
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const quizId = url.searchParams.get('quizId');

  if (!quizId) {
    return new NextResponse(JSON.stringify({message: 'Quiz ID is required'}), {
      status: 400,
    });
  }

  console.log(Number(quizId));

  try {
    await prisma.quiz.delete({
      where: {
        id: Number(quizId),
      },
    });

    return Response.json({message: 'ok', status: 200});
  } catch (error) {
    console.log(error);
    return Response.json(
      {error, message: 'Failed to delete quiz'},
      {status: 500}
    );
  }
}
