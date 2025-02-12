import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      <div className="flex flex-col p-8 md:p-12 bg-white">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center">
            <img
              src="/images/logo.png"
              alt="Willbuild"
              className="h-10 w-auto"
            />
          </a>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>
      <div className="relative hidden lg:block bg-[#F8F9FC]">
        <img
          src="/images/login.jpg"
          alt="Construction site background"
          className="absolute inset-0 h-full w-full object-cover object-center dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
} 