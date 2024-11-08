import {prisma} from '@/lib/prisma';

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

export async function GET(req: Request) {
  const body = await req.json();
  console.log(body);
  try {
    const answers = await prisma.answer.findMany({
      where: {
        choiceId: body.quizId,
      },
    });
    Response.json({answers, status: 200});
  } catch (error) {
    return Response.json(
      {error, message: 'Failed to create quiz'},
      {status: 500}
    );
  }
}
