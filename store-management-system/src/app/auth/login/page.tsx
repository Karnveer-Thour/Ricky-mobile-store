'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';

// Import UI components
import Inputcontainer from '@/components/Inputcontainer';
import Button from '@/components/Button';
import Input from '@/components/Input';

// Import Redux actions and validation schema
import Maincontainer from '@/UI/Maincontainer';
import Formcontainer from '@/UI/Formcontainer';
import { Loginvalidationschema } from '@/library/yup/login.yup';
import { Eye, EyeClosed } from 'lucide-react';

export default function Login() {
  const dispatch = useDispatch();

  // State to toggle password visibility
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Initialize react-hook-form with Yup validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(Loginvalidationschema), // Yup validation schema
  });

  return (
    <>
      {/* Show skeleton loader while loading */}
      {/* {auth.isLoading && <Skeltonloader />} */}

      {/* Render login form when not loading */}

      <Maincontainer>
        <Formcontainer className="max-w-xl p-8">
          <div className="h-32 flex justify-center items-center">
            <img src="/assets/images/logo.png" alt="loading" className=" border-2 h-full" />
          </div>
          <h1 className="text-3xl font-bold text-center text-gray-900 p-2 h-auto">
            Welcome to <span className="text-[#ffb396]">Ricky mobile store!</span>
          </h1>
          {/* Login form header */}
          <h2 className="text-xl text-center text-gray-900 p-2 h-auto">Admin Login</h2>

          {/* Login form */}
          <form
            className="flex flex-col justify-center items-center"
            onSubmit={handleSubmit(() => {})}
          >
            {/* Email input */}
            <Inputcontainer type={'email'} error={errors?.email}>
              <Input
                id="email"
                placeholder="Enter your email"
                {...register('email')}
                className={'border-gray-500 focus-within:ring-2 focus-within:ring-blue-300'}
              />
            </Inputcontainer>
            <Inputcontainer type={'password'} error={errors?.password}>
              <div className="relative mt-1 w-full">
                <div className="flex items-center w-full rounded-md border-2 border-gray-500 focus-within:ring-2 focus-within:ring-blue-300 transition">
                  <Input
                    type={passwordVisible ? 'text' : 'password'}
                    id="password"
                    placeholder="Enter your password"
                    className="flex-1 px-4 py-2 rounded-md bg-transparent focus:outline-none border-none"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    aria-label={passwordVisible ? 'Hide password' : 'Show password'}
                    className="p-2 text-gray-600 hover:text-blue-500 focus:outline-none rounded-md"
                  >
                    {passwordVisible?<Eye />:<EyeClosed/>}
                  </button>
                </div>
              </div>
            </Inputcontainer>
            <Button
              name={'Login'}
              handler={undefined}
              value={undefined}
              className={'max-w-[90%]'}
            />
          </form>
        </Formcontainer>
        <h1 className="mt-8">© Copyrights Alectify 2025. All Rights Reserved.</h1>
      </Maincontainer>
    </>
  );
}
