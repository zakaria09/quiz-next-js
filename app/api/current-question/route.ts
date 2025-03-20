import {prisma} from '@/lib/prisma';
import {NextResponse} from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const quizResultId = url.searchParams.get('quizResultId');
  const questionId = url.searchParams.get('questionId');

  if (!quizResultId || !questionId) {
    return new NextResponse(
      JSON.stringify({message: 'Quiz Result ID is required and questionId'}),
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
        answers: {
          where: {
            questionId: Number(questionId), // Filter answers by questionId
          },
          include: {
            choices: true,
            question: {
              include: {
                choices: true,
              },
            },
          },
        },
      },
    });

    if (quizResult?.answers.length > 0) {
      const selectedChoices = [];
      const [answer] = quizResult.answers;
      const selectedIds = answer.choices.map((selected) => selected.choiceId);
      answer.question.choices.map((choice) => {
        if (selectedIds.includes(choice.id)) selectedChoices.push(choice);
      });
      return NextResponse.json({selectedChoices}, {status: 200});
    }

    return NextResponse.json({selectedChoices: null}, {status: 200});
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {error: error, message: 'Failed to fetch answers'},
      {status: 500}
    );
  }
}
