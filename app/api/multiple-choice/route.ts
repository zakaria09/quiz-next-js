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
    const quiz = await prisma.quiz.findUnique({
      where: {
        id: Number(quizId),
      },
      include: {
        questions: {
          include: {
            answers: true,
          },
        },
      },
    });

    const questionsFormated = quiz?.questions.map((question) => {
      const numOfCorrectAnswers = question.answers.filter(
        (choice) => choice.isCorrect
      ).length;
      const removeIsCorrect = question.answers.map((answer) => ({
        id: answer.id,
        choice: answer.choice,
        choiceId: answer.choiceId,
        isCorrect: answer.isCorrect,
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
    // Step 1: Find all questions associated with the quiz
    const questions = await prisma.question.findMany({
      where: {quizId: Number(quizId)},
      select: {id: true}, // Only fetch question IDs
    });

    // Step 2: Extract question IDs
    const questionIds = questions.map((q) => q.id);
    console.log(questionIds);

    // Step 3: Delete all answers linked to those questions
    await prisma.answer.deleteMany({
      where: {choiceId: {in: questionIds}}, // Delete answers linked to questions
    });

    // Delete all questions and answers associated with the quiz
    await prisma.question.deleteMany({
      where: {
        quizId: Number(quizId),
      },
    });

    // Finally delete the quiz
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
