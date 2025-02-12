import React from 'react';
import { LoginForm } from '@/components/login-form';
import { AuthLayout } from '@/components/layout/auth-layout';

export const LoginPage: React.FC = () => {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}; 