import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, ArrowLeft, TrendingUp, AlertTriangle } from 'lucide-react';
import ProjectModal from '../components/ProjectModal';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageTitle } from '../components/ui/page-title';
import { projectApi } from '../services/api';
import { IProject } from '../services/types';
import { toast } from '../components/ui/use-toast';
import { setSelectedProject } from '@/store/slices/projectSlice';

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<IProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch projects
  const fetchProjects = async (page: number = 1) => {
    try {
      setIsLoading(true);
      const response = await projectApi.getAll(page);
      setProjects(response.data);
      if (response.pagination) {
        setTotalPages(response.pagination.pages);
        setCurrentPage(response.pagination.page);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch projects",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAddProject = () => {
    setSelectedProject(null);
    setIsModalOpen(true);
  };

  const handleEditProject = (project: IProject) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        // Update UI state immediately
        setProjects(prevProjects => prevProjects.filter(project => project._id !== projectId));
        
        // Make API call
        await projectApi.delete(projectId);
        toast({
          title: "Success",
          description: "Project deleted successfully"
        });
      } catch (error) {
        // Revert UI state on error
        fetchProjects(currentPage);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to delete project",
          variant: "destructive"
        });
      }
    }
  };

  const handleSaveProject = async (projectData: any) => {
    try {
      if (selectedProject) {
        // Edit existing project
        await projectApi.update(selectedProject._id, projectData);
        toast({
          title: "Success",
          description: "Project updated successfully"
        });
      } else {
        // Add new project
        await projectApi.create(projectData);
        toast({
          title: "Success",
          description: "Project created successfully"
        });
      }
      setIsModalOpen(false);
      fetchProjects(currentPage);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save project",
        variant: "destructive"
      });
    }
  };

  const getBudgetStatusColor = (variance: number) => {
    if (variance <= 0) return 'text-green-600';
    if (variance < 50000) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatBudgetVariance = (variance: number) => {
    const prefix = variance <= 0 ? 'Under budget: ' : 'Over budget: ';
    return `${prefix}PKR ${Math.abs(variance).toLocaleString()}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageTitle
        title="Projects"
        rightContent={
          <Button onClick={handleAddProject} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Project
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project._id} className="flex flex-col">
            <CardHeader className="pb-2 text-center">
              <CardTitle className="text-xl font-bold">{project.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Estimated Budget:</span>
                    <span className="font-medium">PKR {project.estimatedBudget.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Actual Cost:</span>
                    <span className="font-medium">PKR {project.actualCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Budget Status:</span>
                    <span className={`font-medium ${getBudgetStatusColor(project.budgetVariance)}`}>
                      {formatBudgetVariance(project.budgetVariance)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Timeline:</span>
                    <span className="font-medium">
                      {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <Badge variant="outline" className={
                      project.status === 'ongoing' ? 'bg-green-100 text-green-800 border-green-200' :
                      project.status === 'completed' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                      'bg-yellow-100 text-yellow-800 border-yellow-200'
                    }>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Completion</span>
                      <span className="font-medium">{project.completion}%</span>
                    </div>
                    <Progress value={project.completion} className="h-2" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Phases: {project.phaseCount}</span>
                    <span className="text-muted-foreground">Tasks: {project.taskCount}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              {project.budgetVariance > 50000 && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Budget variance exceeds threshold</span>
                </div>
              )}
              <div className="flex gap-2 w-full">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  onClick={() => handleEditProject(project)}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDeleteProject(project._id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
              <Button
                variant="default"
                className="w-full"
                onClick={() => navigate(`/projects/${project._id}/phases`)}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                View Phases
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => fetchProjects(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="py-2 px-4">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => fetchProjects(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {isModalOpen && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveProject}
        />
      )}
    </div>
  );
};

export default Projects;