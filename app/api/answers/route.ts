import {prisma} from '@/lib/prisma';
import {NextResponse} from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const quizId = url.searchParams.get('quizId');

  if (!quizId) {
    return new NextResponse(JSON.stringify({message: 'Quiz ID is required'}), {
      status: 400,
    });
  }

  try {
    const answers = await prisma.answer.findMany({
      where: {
        choiceId: Number(quizId),
      },
    });

    return NextResponse.json({answers, status: 200}, {status: 200});
  } catch (error) {
    return NextResponse.json(
      {error: error, message: 'Failed to fetch answers'},
      {status: 500}
    );
  }
}
