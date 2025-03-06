'use server';
import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';

export async function revalidateQuiz() {
  revalidatePath('/quiz-dashboard', 'page');
  redirect('/quiz-dashboard');
}
