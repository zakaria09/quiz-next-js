'use server';
import {prisma} from '@/lib/prisma';
import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';

export async function revalidateQuiz() {
  revalidatePath('/quiz-dashboard', 'page');
  redirect('/quiz-dashboard');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function addQuiz(payload: any) {
  await prisma.quiz.create({
    data: {
      ...payload,
    },
  });
  revalidatePath('/quiz-dashboard', 'page');
  redirect('/quiz-dashboard');
}
