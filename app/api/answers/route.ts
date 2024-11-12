import {prisma} from '@/lib/prisma';
import {NextResponse} from 'next/server';

export async function POST(request: Request) {
  try {
    const {quizIds} = await request.json();

    if (!quizIds || !Array.isArray(quizIds) || quizIds.length === 0) {
      return new NextResponse(
        JSON.stringify({message: 'Quiz ID is required'}),
        {
          status: 400,
        }
      );
    }

    const answers = await prisma.answer.findMany({
      where: {
        choiceId: {
          in: quizIds, // Ensure `quizIds` is an array of IDs
        },
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
