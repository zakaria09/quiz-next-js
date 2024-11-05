import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  const body = await req.json();

  const result = await prisma.quiz.create({
    data: {
      ...body,
    },
  });

  if (!result)
    return Response.json({message: 'Failed to create quiz'}, {status: 500});

  return Response.json({message: 'ok', status: 200, data: result});
}
