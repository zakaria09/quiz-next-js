'use client';
import React from 'react';
import {Card, CardContent, CardHeader} from '@/components/ui/card';
import {Checkbox} from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {useFieldArray, useForm, useWatch} from 'react-hook-form';
import {MdDelete} from 'react-icons/md';
import {v4 as uuidv4} from 'uuid';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import classNames from 'classnames';
import {MultipleChoiceQuestion} from '../shared/types/types';
import {alphabet, defaultChoiceFields} from '../shared/constants/constants';
import useQuizStore from '@/store/quizStore';

const formSchema = z.object({
  question: z.string().min(3, 'Please enter a question.'),
  answers: z
    .array(
      z.object({
        id: z.string(),
        choice: z.string().min(1, 'Please enter a choice.'),
        isCorrect: z.boolean().default(false),
      })
    )
    .refine((value) => value.some((item) => item.isCorrect), {
      message: 'Please select at least one correct answer.',
    })
    .refine((value) => value.some((item) => !item.isCorrect), {
      message: 'all choices cannot be correct'
    }),
});

function MultipleChoiceForm({
  onMultipleChoiceEmit,
}: {
  onMultipleChoiceEmit: (value: MultipleChoiceQuestion) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: '',
      answers: defaultChoiceFields,
    },
    mode: 'onChange',
  });

  const {
    addQuestion,
    addChoice,
  } = useQuizStore();
  
  const {fields, append, remove, update} = useFieldArray({
    control: form.control,
    name: 'answers',
    rules: {required: 'Please add at least one answer.'},
  });

  const watch = useWatch({control: form.control, name: 'answers'});

  const onSubmit = (data: MultipleChoiceQuestion) => {
    addQuestion(data.question)
    addChoice(data.answers)
    onMultipleChoiceEmit(data);
    form.reset();
  };

  const onChecked = ({checked, index}: {checked: boolean; index: number}) => {
    update(index, {...watch[index], isCorrect: checked});
  };

  return (
    <div>
      <div className='py-8'>
        <Card className=' px-6 py-8'>
          <CardHeader>
            <h1 className='font-semibold text-lg'>Multiple Choice Question</h1>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name='question'
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Question</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                />
                {fields.map((choiceField, index) => (
                  <FormField
                    control={form.control}
                    key={choiceField.id}
                    name={`answers.${index}.choice`}
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Choice {alphabet[index]}</FormLabel>
                        <FormControl>
                          <div className='flex justify-between'>
                            <Input {...field} />
                            {fields.length - 1 === index &&
                              fields.length > 2 && (
                                <div className='px-4 py-2'>
                                  <button
                                    type='button'
                                    onClick={() => remove(index)}
                                  >
                                    <MdDelete className='text-xl' />
                                  </button>
                                </div>
                              )}
                            <div className='py-2 px-4'>
                              <div>
                                <FormField
                                  control={form.control}
                                  key={index}
                                  name={`answers.${index}.isCorrect`}
                                  render={({field}) => (
                                    <FormItem>
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value}
                                          onCheckedChange={(checked: boolean) =>
                                            onChecked({
                                              checked,
                                              index,
                                            })
                                          }
                                        />
                                      </FormControl>
                                      <FormLabel
                                        className={classNames({
                                          'text-red-600': Boolean(
                                            form.formState.errors?.answers?.root
                                          ),
                                        })}
                                      >
                                        Answer
                                      </FormLabel>
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage></FormMessage>
                        {form.formState.errors?.answers?.root && (
                          <p className='text-sm text-red-600'>
                            {form.formState.errors?.answers?.root.message}
                          </p>
                        )}
                      </FormItem>
                    )}
                  />
                ))}
                <button
                  type='button'
                  className='btn-outline primary'
                  onClick={() =>
                    append({choice: '', isCorrect: false, id: uuidv4()})
                  }
                >
                  Add Choice
                </button>
                <div className='flex justify-end pt-6'>
                  <button type='submit' className='btn-primary'>
                    Add Question
                  </button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default MultipleChoiceForm;
