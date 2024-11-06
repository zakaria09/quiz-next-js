import {prisma} from '@/lib/prisma';

export async function POST(req: Request) {
  const body = await req.json();

  console.log(body);

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
