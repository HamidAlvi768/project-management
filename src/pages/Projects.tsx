import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, ArrowLeft, TrendingUp } from 'lucide-react';
import ProjectModal from '../components/ProjectModal';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageTitle } from '../components/ui/page-title';
import { IProject, IProjectInput } from '../services/types';
import { useToast } from "@/components/ui/use-toast";
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProjects, createProject, updateProject, deleteProject, setSelectedProject } from '@/store/slices/projectSlice';
import { RootState } from '@/store/store';

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { projects, selectedProject, isLoading, error } = useAppSelector((state: RootState) => state.project);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    console.log('Fetching projects...');
    dispatch(fetchProjects())
      .unwrap()
      .then((response) => {
        console.log('Projects fetched successfully:', response);
      })
      .catch((error) => {
        console.error('Error fetching projects:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to load projects",
          variant: "destructive",
        });
      });
  }, [dispatch, toast]);

  // Log state changes
  useEffect(() => {
    console.log('Current projects state:', { projects, isLoading, error });
  }, [projects, isLoading, error]);

  const handleAddProject = () => {
    dispatch(setSelectedProject(null));
    setIsModalOpen(true);
  };

  const handleEditProject = (project: IProject) => {
    dispatch(setSelectedProject(project));
    setIsModalOpen(true);
  };

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await dispatch(deleteProject(projectId)).unwrap();
        toast({
          title: "Success",
          description: "Project deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete project",
          variant: "destructive",
        });
      }
    }
  };

  const handleSaveProject = async (data: IProjectInput) => {
    try {
      if (selectedProject) {
        await dispatch(updateProject({ 
          projectId: selectedProject._id, 
          data 
        })).unwrap();
        toast({
          title: "Success",
          description: "Project updated successfully",
        });
      } else {
        await dispatch(createProject(data)).unwrap();
        toast({
          title: "Success",
          description: "Project created successfully",
        });
      }
      setIsModalOpen(false);
      dispatch(setSelectedProject(null));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save project",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not-started':
        return 'text-gray-500 border-gray-500';
      case 'in-progress':
        return 'text-blue-500 border-blue-500';
      case 'completed':
        return 'text-green-500 border-green-500';
      case 'on-hold':
        return 'text-yellow-500 border-yellow-500';
      default:
        return 'text-gray-500 border-gray-500';
    }
  };

  const formatBudgetVariance = (variance: number) => {
    const prefix = variance <= 0 ? 'Under budget: ' : 'Over budget: ';
    return `${prefix}PKR ${Math.abs(variance).toLocaleString()}`;
  };

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

      {isLoading ? (
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="text-center py-6 text-red-500">
          Error loading projects: {error}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          No projects found. Click "Add Project" to create one.
        </div>
      ) : (
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
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Budget Variance:</span>
                      <span className={`font-medium ${project.budgetVariance <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatBudgetVariance(project.budgetVariance)}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Completion</span>
                        <span className="font-medium">{project.completion}%</span>
                      </div>
                      <Progress value={project.completion} className="h-2" />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Timeline:</span>
                      <span className="font-medium">
                        {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <Badge variant="outline" className={getStatusColor(project.status)}>
                        {project.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Customer:</span>
                      <Badge variant="secondary">
                        {typeof project.customer === 'object' ? project.customer.name : project.customer}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between gap-2">
                <Button variant="outline" size="sm" onClick={() => navigate(`/projects/${project._id}/phases`)}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Phases
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditProject(project)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteProject(project._id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {isModalOpen && (
        <ProjectModal
          project={selectedProject}
          onClose={() => {
            setIsModalOpen(false);
            dispatch(setSelectedProject(null));
          }}
          onSave={handleSaveProject}
        />
      )}
    </div>
  );
};

export default Projects;