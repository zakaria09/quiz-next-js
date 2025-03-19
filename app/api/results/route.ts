import {prisma} from '@/lib/prisma';
import {getUserSession} from '@/lib/session';
import {NextResponse} from 'next/server';

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
