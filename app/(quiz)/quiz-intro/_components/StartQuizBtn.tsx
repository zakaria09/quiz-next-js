'use client';
import React from 'react';
import {FaRegArrowAltCircleRight} from 'react-icons/fa';
import {useRouter} from 'next/navigation';
import axios from 'axios';
import {useMutation} from '@tanstack/react-query';
import useQuizStore from '@/store/quizStore';

export default function StartQuizBtn({quizId}: {quizId: number}) {
  const {setQuizResultId} = useQuizStore();
  const {mutate} = useMutation<{data: {quizResultId: number}}>({
    mutationFn: () => axios.post(`/api/results`, {quizId}),
    onSuccess: (data) => {
      const {quizResultId} = data.data;
      console.log('Quiz started successfully:', data);
      setQuizResultId(quizResultId);
      router.push(
        `/take-quiz/${quizId}?quizResultId=${quizResultId}&question=0`
      );
    },
    onError: (error) => {
      console.error('Error starting quiz:', error);
    },
  });

  const router = useRouter();
  const handleClick = () => {
    mutate();
  };
  return (
    <div>
      <button onClick={handleClick} className='btn-primary flex gap-1'>
        <FaRegArrowAltCircleRight className='self-center text-lg' />
        Start Quiz
      </button>
    </div>
  );
}
