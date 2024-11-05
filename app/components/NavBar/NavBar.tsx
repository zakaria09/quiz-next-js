'use client';
import React, {useEffect, useRef, useState} from 'react';
import Link from 'next/link';
import {RxHamburgerMenu} from 'react-icons/rx';
import classNames from 'classnames';
import {IoCloseSharp} from 'react-icons/io5';
import './NavBar.css';

export default function NavBar() {
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

  return (
    <>
      <nav
        ref={menuRef}
        className='sticky top-0 shadow-sm z-50 bg-white border-b-4 border-gray-200 border-solid'
      >
        <div className='flex justify-around mx-auto py-10 px-10 md:px-20 relative'>
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
              <Link className='link' href={'/blog'} onClick={handleToggleNav}>
                Blog
              </Link>
            </li>
            <li>
              <Link
                className='link'
                href={'/contact'}
                onClick={handleToggleNav}
              >
                Contact
              </Link>
            </li>
            <li>
              <div className='flex gap-4'>
                <Link
                  className='btn-primary'
                  href={'/book-call'}
                  onClick={handleToggleNav}
                >
                  <button>Login</button>
                </Link>
                <Link
                  className='btn-outline primary'
                  href={'/our-process'}
                  onClick={handleToggleNav}
                >
                  <button>Sign Up</button>
                </Link>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
