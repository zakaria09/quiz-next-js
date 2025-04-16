'use client';
import React, {useEffect, useRef, useState} from 'react';
import Link from 'next/link';
import {RxHamburgerMenu} from 'react-icons/rx';
import classNames from 'classnames';
import {IoCloseSharp} from 'react-icons/io5';
import './NavBar.css';
import {signOut, useSession} from 'next-auth/react';

export default function NavBar() {
  const {data: session} = useSession();
  const [navOpen, setNavOpen] = useState<boolean>(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (menuRef.current?.contains(event.target as Node)) return;
      setNavOpen(false);
    };
    document.addEventListener('mousedown', handler);

    return () => {
      document.removeEventListener('mousedown', handler);
    };
  }, []);

  const handleToggleNav = () => {
    setNavOpen(!navOpen);
  };

  const signOutHandle = () => {
    handleToggleNav();
    signOut();
  };

  return (
    <>
      <nav
        ref={menuRef}
        className='sticky top-0 shadow-sm z-50 bg-white border-b-4 border-gray-200 border-solid'
      >
        <div className='flex justify-around mx-auto py-10 relative'>
          <Link
            href={'/'}
            className='text-xl my-auto bg-gradient-to-t from-slate-600 to-slate-900 bg-clip-text text-transparent'
          >
            <h1 className='font-black '>Quizer</h1>
          </Link>

          <span onClick={handleToggleNav} className='md:hidden self-center'>
            {!navOpen ? (
              <RxHamburgerMenu className='text-4xl cursor-pointer' />
            ) : (
              <IoCloseSharp className='text-4xl cursor-pointer' />
            )}
          </span>

          <ul
            className={classNames(
              `absolute left-0  bg-white  w-full flex 
              flex-col gap-8 items-center py-8 border-b-4 border-gray-200 
              border-solid md:static md:border-0
              md:flex-row md:justify-between md:max-w-[32rem] md:p-0`,
              `${navOpen ? 'top-[116px]' : 'top-[-390px]'}`
            )}
          >
            <li>
              <Link
                className='link'
                href={'/quiz-dashboard'}
                onClick={handleToggleNav}
              >
                Quizzes
              </Link>
            </li>
            <li className='flex gap-4'>
              {!session ? (
                <>
                  <Link
                    className='btn-primary'
                    href={'/signin'}
                    onClick={handleToggleNav}
                  >
                    <button>Login</button>
                  </Link>
                </>
              ) : (
                <button
                  className='btn-outline primary cursor-pointer'
                  onClick={signOutHandle}
                >
                  Sign Out
                </button>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
