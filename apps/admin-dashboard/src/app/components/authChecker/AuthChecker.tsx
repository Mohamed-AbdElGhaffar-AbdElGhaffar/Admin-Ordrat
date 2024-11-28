"use client";

import { useEffect, useState } from 'react';
import AppointmentDashboard from '@/app/shared/appointment/dashboard';

export default function AuthChecker({lang}:{lang?:string}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return <h1>sign in</h1>;
}