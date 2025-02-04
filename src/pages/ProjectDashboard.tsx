import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PageTitle } from '@/components/ui/page-title';
import { projectApi } from '@/services/api';
import { IProjectStats } from '@/services/types';
import ProjectStats from '@/components/ProjectStats';
import Loading from '@/components/ui/loading';
import { toast } from '@/components/ui/use-toast';

const ProjectDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<IProjectStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const response = await projectApi.getStats();
        setStats(response.data);
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch project statistics",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return <Loading fullScreen text="Loading dashboard..." />;
  }

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Failed to load dashboard</h1>
        <Button onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageTitle
        title="Project Dashboard"
        rightContent={
          <Button onClick={() => navigate('/projects')}>
            View All Projects
          </Button>
        }
      />

      <ProjectStats stats={stats} />
    </div>
  );
};

export default ProjectDashboard; 