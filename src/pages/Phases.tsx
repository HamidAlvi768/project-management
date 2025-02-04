import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, ArrowLeft, TrendingUp, AlertTriangle, PieChart } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import PhaseModal from '../components/PhaseModal';
import PhaseCard from '../components/PhaseCard';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageTitle } from '../components/ui/page-title';

interface Phase {
  id: number;
  name: string;
  estimatedBudget: number;
  actualCost: number;
  startDate: string;
  endDate: string;
  status: 'not-started' | 'in-progress' | 'completed';
  description: string;
  completion: number;
  taskCount: number;
  budgetVariance: number;
  laborCost: number;
  materialCost: number;
  equipmentCost: number;
  dependencies: number[]; // IDs of phases that must be completed before this one
}

interface ProjectSummary {
  totalBudget: number;
  totalActualCost: number;
  totalVariance: number;
  overallCompletion: number;
  phaseCount: number;
  totalTaskCount: number;
}

const Phases: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [projectName, setProjectName] = useState<string>("");

  useEffect(() => {
    const project = [
      { id: 1, name: "Commercial Complex Alpha" },
      { id: 2, name: "Residential Towers Beta" }
    ].find(p => p.id === Number(projectId));
    
    if (project) {
      setProjectName(project.name);
    }
  }, [projectId]);

  const [phases, setPhases] = useState<Phase[]>([
    {
      id: 1,
      name: "Foundation Work",
      estimatedBudget: 250000,
      actualCost: 260000,
      startDate: "2024-02-01",
      endDate: "2024-03-15",
      status: "in-progress",
      description: "Excavation and foundation laying for the main building",
      completion: 75,
      taskCount: 12,
      budgetVariance: 10000,
      laborCost: 100000,
      materialCost: 140000,
      equipmentCost: 20000,
      dependencies: []
    },
    {
      id: 2,
      name: "Structural Framework",
      estimatedBudget: 500000,
      actualCost: 480000,
      startDate: "2024-03-16",
      endDate: "2024-05-30",
      status: "not-started",
      description: "Construction of main structural framework and support systems",
      completion: 0,
      taskCount: 18,
      budgetVariance: -20000,
      laborCost: 200000,
      materialCost: 250000,
      equipmentCost: 30000,
      dependencies: [1]
    }
  ]);

  const [projectSummary, setProjectSummary] = useState<ProjectSummary>({
    totalBudget: 0,
    totalActualCost: 0,
    totalVariance: 0,
    overallCompletion: 0,
    phaseCount: 0,
    totalTaskCount: 0
  });

  useEffect(() => {
    // Calculate project summary from phases
    const summary = phases.reduce((acc, phase) => ({
      totalBudget: acc.totalBudget + phase.estimatedBudget,
      totalActualCost: acc.totalActualCost + phase.actualCost,
      totalVariance: acc.totalVariance + phase.budgetVariance,
      overallCompletion: acc.overallCompletion + phase.completion,
      phaseCount: acc.phaseCount + 1,
      totalTaskCount: acc.totalTaskCount + phase.taskCount
    }), {
      totalBudget: 0,
      totalActualCost: 0,
      totalVariance: 0,
      overallCompletion: 0,
      phaseCount: 0,
      totalTaskCount: 0
    });

    // Calculate average completion
    summary.overallCompletion = Math.round(summary.overallCompletion / summary.phaseCount);

    setProjectSummary(summary);
  }, [phases]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);
  const [isProjectDetailsOpen, setIsProjectDetailsOpen] = useState(false);

  const getStatusColor = (status: Phase['status']) => {
    switch (status) {
      case 'not-started':
        return 'bg-gray-100 text-gray-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddPhase = () => {
    setSelectedPhase(null);
    setIsModalOpen(true);
  };

  const handleEditPhase = (phase: Phase) => {
    setSelectedPhase(phase);
    setIsModalOpen(true);
  };

  const handleDeletePhase = (phaseId: number) => {
    if (window.confirm('Are you sure you want to delete this phase?')) {
      setPhases(phases.filter(p => p.id !== phaseId));
    }
  };

  const handleSavePhase = (phaseData: Omit<Phase, 'id' | 'taskCount' | 'budgetVariance'>) => {
    if (selectedPhase) {
      // Edit existing phase
      setPhases(phases.map(p => 
        p.id === selectedPhase.id 
          ? { 
              ...phaseData, 
              id: selectedPhase.id,
              taskCount: selectedPhase.taskCount,
              budgetVariance: phaseData.actualCost - phaseData.estimatedBudget
            }
          : p
      ));
    } else {
      // Add new phase
      const newPhase = {
        ...phaseData,
        id: Math.max(0, ...phases.map(p => p.id)) + 1,
        taskCount: 0,
        budgetVariance: phaseData.actualCost - phaseData.estimatedBudget
      };
      setPhases([...phases, newPhase]);
    }
  };

  const getBudgetStatusColor = (variance: number) => {
    if (variance <= 0) return 'text-green-600';
    if (variance < 25000) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatBudgetVariance = (variance: number) => {
    const prefix = variance <= 0 ? 'Under budget: ' : 'Over budget: ';
    return `${prefix}$${Math.abs(variance).toLocaleString()}`;
  };

  const calculateCostBreakdown = (phase: Phase) => {
    const total = phase.laborCost + phase.materialCost + phase.equipmentCost;
    return {
      labor: Math.round((phase.laborCost / total) * 100),
      material: Math.round((phase.materialCost / total) * 100),
      equipment: Math.round((phase.equipmentCost / total) * 100)
    };
  };

  return (
    <div className="space-y-6">
      <PageTitle
        title={`${projectName} Phases`}
        leftContent={
          <p className="text-sm text-muted-foreground">Project ID: {projectId}</p>
        }
        rightContent={
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setIsProjectDetailsOpen(true)}
            >
              <PieChart className="h-4 w-4" />
              Project Details
            </Button>
            <Button onClick={handleAddPhase} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Phase
            </Button>
          </div>
        }
      />

      {/* Project Details Modal */}
      <Dialog open={isProjectDetailsOpen} onOpenChange={setIsProjectDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Project Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-x-24 gap-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Budget:</span>
                  <span className="font-medium w-[180px] text-right">${projectSummary.totalBudget.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Actual Cost:</span>
                  <span className="font-medium w-[180px] text-right">${projectSummary.totalActualCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Overall Variance:</span>
                  <div className={`font-medium w-[180px] text-right ${getBudgetStatusColor(projectSummary.totalVariance)}`}>
                    ${Math.abs(projectSummary.totalVariance).toLocaleString()}
                    <div className="text-xs text-muted-foreground">
                      {projectSummary.totalVariance <= 0 ? 'Under budget' : 'Over budget'}
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Phases:</span>
                  <span className="font-medium">{projectSummary.phaseCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Tasks:</span>
                  <span className="font-medium">{projectSummary.totalTaskCount}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Overall Progress</span>
                    <span className="font-medium">{projectSummary.overallCompletion}%</span>
                  </div>
                  <Progress value={projectSummary.overallCompletion} className="h-2" />
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {phases.map((phase) => (
          <PhaseCard
            key={phase.id}
            phase={phase}
            onEdit={handleEditPhase}
            onDelete={handleDeletePhase}
            onViewTasks={(id) => navigate(`/projects/${projectId}/phases/${id}/tasks`)}
          />
        ))}
      </div>

      <PhaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePhase}
        phase={selectedPhase}
      />
    </div>
  );
};

export default Phases; 