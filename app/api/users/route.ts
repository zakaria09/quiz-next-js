import {prisma} from '@/lib/prisma';
import {NextResponse} from 'next/server';

export async function GET() {
  try {
    const users = await prisma.user.findMany({select: {name: true, id: true}});
    const options = users.map((user) => ({value: user.id, label: user.name}));
    return NextResponse.json(options, {status: 200});
  } catch (error) {
    return NextResponse.json(
      {error: error, message: 'Failed to fetch answers'},
      {status: 500}
    );
  }
}
