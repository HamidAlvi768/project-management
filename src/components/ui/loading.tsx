import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

const Loading: React.FC<LoadingProps> = ({ fullScreen = false, size = 'md', text }) => {
  const content = (
    <>
      <Loader2 
        className={`animate-spin ${sizeMap[size]}`}
        data-testid="loading-spinner"
        role="status"
      />
      {text && <span className="ml-2">{text}</span>}
    </>
  );

  if (fullScreen) {
    return (
      <div 
        className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        data-testid="loading-container"
      >
        <div className="flex items-center">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center">
      {content}
    </div>
  );
};

export default Loading; 