import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageTitle } from '../components/ui/page-title';
import PhaseModal from '../components/PhaseModal';
import { phaseApi, projectApi } from '../services/api';
import { IPhase, IPhaseInput, IProject } from '../services/types';
import { toast } from '../components/ui/use-toast';

const Phases: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [phases, setPhases] = useState<IPhase[]>([]);
  const [project, setProject] = useState<IProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<IPhase | null>(null);

  // Fetch project and phases
  const fetchData = async () => {
    if (!projectId) return;
    
    try {
      setIsLoading(true);
      const [projectResponse, phasesResponse] = await Promise.all([
        projectApi.getOne(projectId),
        phaseApi.getAllForProject(projectId)
      ]);
      setProject(projectResponse.data);
      setPhases(phasesResponse.data);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [projectId]);

  const handleAddPhase = () => {
    setSelectedPhase(null);
    setIsModalOpen(true);
  };

  const handleEditPhase = (phase: IPhase) => {
    setSelectedPhase(phase);
    setIsModalOpen(true);
  };

  const handleDeletePhase = async (phaseId: string) => {
    if (!projectId) return;
    
    if (window.confirm('Are you sure you want to delete this phase?')) {
      try {
        await phaseApi.delete(projectId, phaseId);
        // Update local state immediately
        setPhases(prevPhases => prevPhases.filter(phase => phase._id !== phaseId));
        toast({
          title: "Success",
          description: "Phase deleted successfully"
        });
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to delete phase",
          variant: "destructive"
        });
      }
    }
  };

  const handleSavePhase = async (data: IPhaseInput) => {
    if (!projectId) return;
    
    try {
      if (selectedPhase) {
        // Edit existing phase
        await phaseApi.update(projectId, selectedPhase._id, data);
        toast({
          title: "Success",
          description: "Phase updated successfully"
        });
      } else {
        // Add new phase
        await phaseApi.create(projectId, data);
        toast({
          title: "Success",
          description: "Phase created successfully"
        });
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save phase",
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

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Project not found</h1>
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
        title={`Phases - ${project.name}`}
        leftContent={
          <Button variant="outline" onClick={() => navigate('/projects')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        }
        rightContent={
          <Button onClick={handleAddPhase} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Phase
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {phases.map((phase) => (
          <Card key={phase._id} className="flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold">{phase.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Estimated Budget:</span>
                    <span className="font-medium">PKR {phase.estimatedBudget.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Actual Cost:</span>
                    <span className="font-medium">PKR {phase.actualCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Budget Status:</span>
                    <span className={`font-medium ${getBudgetStatusColor(phase.budgetVariance)}`}>
                      {formatBudgetVariance(phase.budgetVariance)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Timeline:</span>
                    <span className="font-medium">
                      {new Date(phase.startDate).toLocaleDateString()} - {new Date(phase.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <Badge variant="outline" className={
                      phase.status === 'in-progress' ? 'bg-green-100 text-green-800 border-green-200' :
                      phase.status === 'completed' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                      phase.status === 'on-hold' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                      phase.status === 'cancelled' ? 'bg-red-100 text-red-800 border-red-200' :
                      'bg-gray-100 text-gray-800 border-gray-200'
                    }>
                      {phase.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Completion</span>
                      <span className="font-medium">{phase.completion}%</span>
                    </div>
                    <Progress value={phase.completion} className="h-2" />
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{phase.description}</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tasks: {phase.taskCount}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-xs text-muted-foreground block">Labor</span>
                      <span className="text-sm font-medium">PKR {phase.laborCost.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Material</span>
                      <span className="text-sm font-medium">PKR {phase.materialCost.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Equipment</span>
                      <span className="text-sm font-medium">PKR {phase.equipmentCost.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              {phase.budgetVariance > 50000 && (
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
                  onClick={() => handleEditPhase(phase)}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDeletePhase(phase._id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
              <Button
                variant="default"
                className="w-full"
                onClick={() => navigate(`/projects/${projectId}/phases/${phase._id}/tasks`)}
              >
                View Tasks
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {isModalOpen && (
        <PhaseModal
          phase={selectedPhase}
          projectId={projectId!}
          availableDependencies={phases.map(p => ({ _id: p._id, name: p.name }))}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSavePhase}
        />
      )}
    </div>
  );
};

export default Phases; 