'use client';

import React, {useState} from 'react';
import {MdDeleteOutline} from 'react-icons/md';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {useParams, useRouter} from 'next/navigation';
import {useMutation} from '@tanstack/react-query';
import axios from 'axios';

const deleteQuiz = (id: string) =>
  axios.delete(`/api/multiple-choice?quizId=${id}`);

export default function DeleteBtn() {
  const [open, setOpen] = useState(false);
  const {id} = useParams();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: () => deleteQuiz(id as string),
    onError: () => {
      // An error happened!
      console.log('error');
    },
    onSuccess: () => {
      // Boom baby!
      router.push('/quiz-dashboard');
      console.log('success');
    },
  });

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className='btn-outline warn flex gap-1'
      >
        <MdDeleteOutline className='self-center text-lg' />
        Delete
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              quiz.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <button
              className='btn-outline secondary'
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <button
              className='btn-outline warn'
              onClick={() => {
                console.log('Quiz deleted');
                mutation.mutate();
              }}
            >
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
