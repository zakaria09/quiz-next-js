import {Card, CardContent, CardHeader} from '@/components/ui/card';
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
import {zodResolver} from '@hookform/resolvers/zod';
import React from 'react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';

const formSchema = z.object({
  name: z.string().min(3, 'Please enter a name.'),
  description: z.string().min(3, 'Please enter a description.'),
});

interface QuizDescription {
  name: string;
  description: string;
}

function QuizIntro({
  onCompleteEmit,
}: {
  onCompleteEmit: (value: QuizDescription) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onSubmit = (data: any) => {
    onCompleteEmit(data);
  };

  return (
    <div className='min-h-[calc(100vh-124px)]'>
      <div className='py-8'>
        <Card className=' px-6 py-8'>
          <CardHeader>
            <h1 className='font-semibold text-lg'>Quiz Introduction</h1>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name='name'
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Quiz Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='Science quiz...' />
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='description'
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder='Describe what this quiz will be about...'
                        />
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                />
                <div className='flex justify-end pt-6'>
                  <button type='submit' className='btn-primary'>
                    Next
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

export default QuizIntro;