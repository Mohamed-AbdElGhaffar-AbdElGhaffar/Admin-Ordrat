'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useGuardContext } from '../context/GuardContext';

type Props = {
  children: React.ReactNode;
  lang?: string;
};

const SessionGuard = ({ children, lang = 'en' }: Props) => {
  const { guard, setGuard } = useGuardContext();
  const router = useRouter();
 console.log("guard: ",guard);
 
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      setGuard(true);
    } else {
      setGuard(false);
      router.replace(`/${lang}/signin`);
    }
  }, [lang, router, setGuard]);

  return guard ? <>{children}</> : null;
};

export default SessionGuard;