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
import useQuizStore from '@/store/quizStore';
import {zodResolver} from '@hookform/resolvers/zod';
import React from 'react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {useQuery} from '@tanstack/react-query';
import Select from 'react-select';
import axios from 'axios';
import LoadingSpinner from '@/app/components/LoadingSpinner/LoadingSpinner';

const formSchema = z.object({
  name: z.string().min(3, 'Please enter a name.'),
  description: z.string().min(3, 'Please enter a description.'),
  users: z
    .array(z.object({value: z.string(), label: z.string()}))
    .min(1, 'Please assign at least one user.'),
});

type Option = {
  value: string;
  label: string;
};

function QuizIntro({next}: {next: () => void}) {
  const {data, isLoading} = useQuery<Option[]>({
    queryKey: ['users'],
    queryFn: async () => (await axios('/api/users')).data,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      users: [],
    },
  });

  const {setName, setDescription, setUsers} = useQuizStore();

  const onSubmit = (data: {
    name: string;
    description: string;
    users: Option[];
  }) => {
    const {name, description} = data;
    setName(name);
    setDescription(description);
    const selectedUsers = data.users.map((user) => ({
      id: user.value,
      name: user.label,
    }));
    setUsers(selectedUsers);
    next();
  };

  const renderUserSelect = () => {
    if (isLoading) return <LoadingSpinner />;
    return (
      <FormField
        control={form.control}
        name='users'
        render={({field}) => (
          <FormItem>
            <FormLabel>Assign Users</FormLabel>
            <FormControl>
              <Select
                {...field}
                options={data}
                value={field.value}
                onChange={(selectedOptions) => field.onChange(selectedOptions)}
                isMulti
              />
            </FormControl>
            <FormMessage></FormMessage>
          </FormItem>
        )}
      />
    );
  };

  return (
    <div>
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
                {renderUserSelect()}
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
