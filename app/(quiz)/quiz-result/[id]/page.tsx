import React from 'react';
import QuizResult from '../_components/QuizResult/QuizResult';

export default async function QuizResultPage({
  params,
}: {
  params: Promise<{id: string}>;
}) {
  const param = await params;
  const id = param.id;
  return <QuizResult quizId={Number(id)} />;
}
