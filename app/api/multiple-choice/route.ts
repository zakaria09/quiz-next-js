import {prisma} from '@/lib/prisma';

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

export async function GET() {
  try {
    const quizzes = await prisma.quiz.findMany();
    return Response.json(quizzes);
  } catch (error) {
    return Response.json(
      {error, message: 'Failed to create quiz'},
      {status: 500}
    );
  }
}
