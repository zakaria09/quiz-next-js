import {prisma} from '@/lib/prisma';
import {NextResponse} from 'next/server';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const body = await req.json();

  try {
    await prisma.quiz.create({
      data: {
        ...body,
      },
    });
    return Response.json({message: 'ok', status: 200});
  } catch (error) {
    console.log(error);
    return Response.json(
      {error, message: 'Failed to create quiz'},
      {status: 500}
    );
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const quizId = url.searchParams.get('quizId');
  if (!quizId) {
    return new NextResponse(JSON.stringify({message: 'Quiz ID is required'}), {
      status: 400,
    });
  }

  try {
    const questions = await prisma.question.findMany({
      where: {
        quizId: Number(quizId),
      },
      include: {
        answers: true,
      },
    });

    const questionsFormated = questions.map((question) => {
      const numOfCorrectAnswers = question.answers.filter(
        (choice) => choice.isCorrect
      ).length;
      const removeIsCorrect = question.answers.map((answer) => ({
        id: answer.id,
        choice: answer.choice,
        choiceId: answer.choiceId,
      }));
      return {...question, answers: removeIsCorrect, numOfCorrectAnswers};
    });

    return NextResponse.json({questions: questionsFormated}, {status: 200});
  } catch (error) {
    return NextResponse.json(
      {error: error, message: 'Failed to fetch answers'},
      {status: 500}
    );
  }
}
