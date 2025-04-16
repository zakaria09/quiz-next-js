'use client';
import {signIn} from 'next-auth/react';
import {FaGoogle} from 'react-icons/fa'; // Import the Google icon from react-icons

const SignInPage = () => {
  const handleSignIn = async () => {
    await signIn('google', {callbackUrl: '/quiz-dashboard'});
    // Redirect to quiz-dashboard after successful sign-in
  };
  return (
    <div className='flex justify-center bg-gray-100'>
      <div className='bg-white p-8 rounded-lg shadow-md'>
        <h1 className='text-2xl font-semibold mb-4 text-center'>Sign In</h1>
        <button
          onClick={handleSignIn}
          className='flex items-center justify-center bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition'
        >
          <FaGoogle className='mr-2' /> Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default SignInPage;
