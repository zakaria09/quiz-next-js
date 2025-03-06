import React from 'react';
import MultipleChoice from './_components/MultipleChoice';
import axios from 'axios';
import {Quiz} from '@/app/types/quiz';

export default async function TakeQuizPage({
  params,
}: {
  params: Promise<{id: string}>;
}) {
  const param = await params;
  const id = param.id;
  const response = await (
    await axios.get<Quiz>(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/multiple-choice?quizId=${id}`
    )
  ).data;
  return <MultipleChoice quiz={response} />;
}
