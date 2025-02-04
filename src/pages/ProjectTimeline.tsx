import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageTitle } from '@/components/ui/page-title';
import { projectApi } from '@/services/api';
import { IProjectTimeline } from '@/services/types';
import ProjectTimelineView from '@/components/ProjectTimeline';
import Loading from '@/components/ui/loading';
import { toast } from '@/components/ui/use-toast';

const ProjectTimeline: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [timeline, setTimeline] = useState<IProjectTimeline | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTimeline = async () => {
      if (!projectId) return;

      try {
        setIsLoading(true);
        const response = await projectApi.getTimeline(projectId);
        setTimeline(response.data);
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch timeline",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTimeline();
  }, [projectId]);

  if (isLoading) {
    return <Loading fullScreen text="Loading timeline..." />;
  }

  if (!timeline) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Timeline not found</h1>
        <Button onClick={() => navigate('/projects')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageTitle
        title="Project Timeline"
        leftContent={
          <Button variant="outline" onClick={() => navigate('/projects')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        }
      />

      <ProjectTimelineView timeline={timeline} />
    </div>
  );
};

export default ProjectTimeline; 