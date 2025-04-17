'use client";';
import {Card, CardContent, CardHeader} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {Textarea} from '@/components/ui/textarea';
import {Slider} from '@/components/ui/slider'; // Import the Slider component
import {zodResolver} from '@hookform/resolvers/zod';
import React from 'react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {useMutation} from '@tanstack/react-query';
import axios from 'axios';
import useQuizStore from '@/store/quizStore';
import {MultipleChoiceQuestion} from '../shared/types/types';
import {ProgressBar} from 'react-loader-spinner';

const formSchema = z.object({
  question: z.string().min(3, 'Please enter a question for the AI.'),
  numberOfQuestions: z.number().min(1).max(5), // Add validation for the slider
});

type questionType = z.infer<typeof formSchema>;

export default function AIGenerateQuestion() {
  const form = useForm<questionType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: '',
      numberOfQuestions: 1, // Default value for the slider
    },
  });

  const {addQuestions, shuffleChoices} = useQuizStore();

  const mutation = useMutation<
    MultipleChoiceQuestion[],
    Error,
    {question: string; numberOfQuestions: number}
  >({
    mutationFn: async (data) => {
      const {question, numberOfQuestions} = data;
      const response = await axios.post('/api/quiz-ai', {
        topic: question,
        numberOfQuestions,
      });
      return response.data;
    },
    onSuccess: (data) => {
      addQuestions(
        data.map((question) => ({
          ...question,
          choices: question.choices.map((choice) => ({
            ...choice,
            questionId: choice.questionId?.toString(), // Convert questionId to string
          })),
        }))
      );
      shuffleChoices();
      form.reset();
    },
    onError: (error) => {
      console.error('Error generating question:', error);
    },
  });

  const onSubmit = async (data: questionType) => {
    if (mutation.isPending) return; // Prevent multiple submissions
    await mutation.mutateAsync(data);
  };

  return (
    <div>
      <div className='py-8'>
        <Card className=' px-6 py-8'>
          <CardHeader>
            <h1 className='font-semibold text-lg'>
              Generate Multiple Choice Question With AI
            </h1>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name='question'
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>
                        Generate a multiple choice question on the topic
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='write your topic here...'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='numberOfQuestions'
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Number of questions to generate</FormLabel>
                      <FormControl>
                        <Slider
                          min={1}
                          max={5}
                          step={1}
                          value={[field.value]} // Slider expects an array
                          onValueChange={(value) => field.onChange(value[0])} // Update the form value
                          className='cursor-grab'
                        />
                      </FormControl>
                      <div className='text-sm text-gray-500 mt-2'>
                        Generate {field.value} Multiple Choice Question
                        {field.value > 1 ? 's' : ''}
                      </div>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                />
                <button
                  type='submit'
                  className='btn-primary mt-4 flex gap-2'
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? (
                    <span className='self-center'>
                      <ProgressBar
                        visible={true}
                        height={20}
                        width={20}
                        ariaLabel='progress-bar-loading'
                        wrapperClass=''
                      />
                    </span>
                  ) : null}
                  {mutation.isPending ? 'Generating...' : 'Generate'}
                </button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
