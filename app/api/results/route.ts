import {prisma} from '@/lib/prisma';
import {getUserSession} from '@/lib/session';
import {NextResponse} from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const quizResultId = url.searchParams.get('quizResultId');
  if (!quizResultId) {
    return new NextResponse(
      JSON.stringify({message: 'Quiz Result ID is required'}),
      {
        status: 400,
      }
    );
  }

  try {
    const quizResult = await prisma.quizResult.findUnique({
      where: {
        id: quizResultId,
      },
      include: {
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

    if (!quizResult)
      return NextResponse.json({quiz: null, status: 200}, {status: 200});

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

    console.log('selectedChoices', selectedChoices);

    const response = [];

    quizResult.quiz.questions.reduce((acc, answer) => {
      response.push({
        ...answer,
        selected: selectedChoices[0].choices.map((choice) => ({
          id: choice.choiceId,
          questionId: choice.answer.questionId,
        })),
      });
      return acc;
    }, 0);

    return NextResponse.json(
      {quiz: response, score: quizResult.score},
      {status: 200}
    );
  } catch (error) {
    return NextResponse.json(
      {error: error, message: 'Failed to fetch answers'},
      {status: 500}
    );
  }
}

export async function POST(req: Request) {
  const {quizId} = await req.json();
  const session = await getUserSession();
  if (!session) {
    return Response.json({message: 'Unauthorized', status: 401});
  }
  try {
    const quizCheck = await prisma.quizResult.findFirst({
      where: {
        quizId,
      },
    });

    if (quizCheck?.isCompleted) {
      return NextResponse.json(
        {
          quizResultId: quizCheck.id,
        },
        {status: 200}
      );
    }

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
        {status: 200}
      );
    } else {
      return NextResponse.json(
        {
          quizResultId: quizCheck.id,
        },
        {status: 200}
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {error, message: `Failed ${error}`},
      {status: 500}
    );
  }
}
