import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, ArrowLeft, TrendingUp, AlertTriangle } from 'lucide-react';
import ProjectModal from '../components/ProjectModal';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageTitle } from '../components/ui/page-title';

interface Project {
  id: number;
  name: string;
  estimatedBudget: number;
  actualCost: number;
  startDate: string;
  endDate: string;
  status: 'ongoing' | 'completed' | 'on-hold';
  description: string;
  completion: number;
  stakeholders: string[];
  phaseCount: number;
  taskCount: number;
  budgetVariance: number;
}

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      name: "Commercial Complex Alpha",
      estimatedBudget: 1500000,
      actualCost: 1450000,
      startDate: "2024-02-01",
      endDate: "2024-12-31",
      status: "ongoing",
      description: "A 10-story commercial building with underground parking",
      completion: 45,
      stakeholders: ["John Architect", "Sarah Engineer", "Mike Contractor"],
      phaseCount: 5,
      taskCount: 28,
      budgetVariance: -50000 // negative means under budget (good)
    },
    {
      id: 2,
      name: "Residential Towers Beta",
      estimatedBudget: 2500000,
      actualCost: 2600000,
      startDate: "2024-03-15",
      endDate: "2025-06-30",
      status: "ongoing",
      description: "Twin residential towers with modern amenities",
      completion: 30,
      stakeholders: ["Emma Architect", "David Engineer", "Tom Contractor"],
      phaseCount: 6,
      taskCount: 42,
      budgetVariance: 100000 // positive means over budget (bad)
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleAddProject = () => {
    setSelectedProject(null);
    setIsModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleDeleteProject = (projectId: number) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter(p => p.id !== projectId));
    }
  };

  const handleSaveProject = (projectData: Omit<Project, 'id'>) => {
    if (selectedProject) {
      // Edit existing project
      setProjects(projects.map(p => 
        p.id === selectedProject.id 
          ? { ...projectData, id: selectedProject.id }
          : p
      ));
    } else {
      // Add new project
      const newProject = {
        ...projectData,
        id: Math.max(0, ...projects.map(p => p.id)) + 1
      };
      setProjects([...projects, newProject]);
    }
  };

  const getBudgetStatusColor = (variance: number) => {
    if (variance <= 0) return 'text-green-600';
    if (variance < 50000) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatBudgetVariance = (variance: number) => {
    const prefix = variance <= 0 ? 'Under budget: ' : 'Over budget: ';
    return `${prefix}$${Math.abs(variance).toLocaleString()}`;
  };

  // Add this new effect to update project budgets when phases change
  useEffect(() => {
    const updateProjectWithPhaseData = async (projectId: number) => {
      try {
        // Fetch phases for this project
        const response = await fetch(`/api/projects/${projectId}/phases`);
        const phases = await response.json();
        
        // Calculate totals
        const totals = phases.reduce((acc: any, phase: any) => ({
          estimatedBudget: acc.estimatedBudget + phase.estimatedBudget,
          actualCost: acc.actualCost + phase.actualCost,
          completion: acc.completion + phase.completion,
          phaseCount: acc.phaseCount + 1,
          taskCount: acc.taskCount + phase.taskCount
        }), {
          estimatedBudget: 0,
          actualCost: 0,
          completion: 0,
          phaseCount: 0,
          taskCount: 0
        });

        // Calculate average completion
        totals.completion = Math.round(totals.completion / totals.phaseCount);
        
        // Calculate budget variance
        totals.budgetVariance = totals.actualCost - totals.estimatedBudget;

        // Update the project with new totals
        setProjects(prevProjects => 
          prevProjects.map(p => 
            p.id === projectId
              ? {
                  ...p,
                  estimatedBudget: totals.estimatedBudget,
                  actualCost: totals.actualCost,
                  budgetVariance: totals.budgetVariance,
                  completion: totals.completion,
                  phaseCount: totals.phaseCount,
                  taskCount: totals.taskCount
                }
              : p
          )
        );
      } catch (error) {
        console.error('Error updating project totals:', error);
      }
    };

    // Update all projects
    projects.forEach(project => updateProjectWithPhaseData(project.id));
  }, []); // Run once on component mount

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
          <Card key={project.id} className="flex flex-col">
            <CardHeader className="pb-2 text-center">
              <CardTitle className="text-xl font-bold">{project.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Estimated Budget:</span>
                    <span className="font-medium">${project.estimatedBudget.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Actual Cost:</span>
                    <span className="font-medium">${project.actualCost.toLocaleString()}</span>
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
                  onClick={() => handleDeleteProject(project.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => navigate(`/projects/${project.id}/phases`)}
              >
                View Phases
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProject}
        project={selectedProject}
      />
    </div>
  );
};

export default Projects; 