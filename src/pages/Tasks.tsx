import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageTitle } from '../components/ui/page-title';
import TaskModal from '../components/TaskModal';
import { taskApi, phaseApi, projectApi } from '../services/api';
import { ITask, ITaskInput, IPhase, IProject } from '../services/types';
import { toast } from '../components/ui/use-toast';

const Tasks: React.FC = () => {
  const { projectId, phaseId } = useParams<{ projectId: string; phaseId: string }>();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<ITask[]>([]);
  const [phase, setPhase] = useState<IPhase | null>(null);
  const [project, setProject] = useState<IProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);

  // Fetch project, phase and tasks
  const fetchData = async () => {
    if (!projectId || !phaseId) return;
    
    try {
      setIsLoading(true);
      const [projectResponse, phaseResponse, tasksResponse] = await Promise.all([
        projectApi.getOne(projectId),
        phaseApi.getOne(projectId, phaseId),
        taskApi.getAllForPhase(projectId, phaseId)
      ]);
      setProject(projectResponse.data);
      setPhase(phaseResponse.data);
      setTasks(tasksResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
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
  }, [projectId, phaseId]);

  const handleAddTask = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: ITask) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!projectId || !phaseId) return;
    
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskApi.delete(projectId, phaseId, taskId);
        // Update local state immediately
        setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
        toast({
          title: "Success",
          description: "Task deleted successfully"
        });
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to delete task",
          variant: "destructive"
        });
      }
    }
  };

  const handleSaveTask = async (data: ITaskInput) => {
    if (!projectId || !phaseId) return;
    
    try {
      if (selectedTask) {
        // Edit existing task
        await taskApi.update(projectId, phaseId, selectedTask._id, data);
        toast({
          title: "Success",
          description: "Task updated successfully"
        });
      } else {
        // Add new task
        await taskApi.create(projectId, phaseId, data);
        toast({
          title: "Success",
          description: "Task created successfully"
        });
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save task",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'construction':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'procurement':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'inspection':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!project || !phase) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Project or Phase not found</h1>
        <Button onClick={() => navigate(`/projects/${projectId}/phases`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Phases
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageTitle
        title={`Tasks - ${phase.name} (${project.name})`}
        leftContent={
          <Button variant="outline" onClick={() => navigate(`/projects/${projectId}/phases`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Phases
          </Button>
        }
        rightContent={
          <Button onClick={handleAddTask} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <Card key={task._id} className="flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold">{task.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <Badge variant="outline" className={getStatusColor(task.status)}>
                      {task.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Type:</span>
                    <Badge variant="outline" className={getTypeColor(task.type)}>
                      {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Timeline:</span>
                    <span className="font-medium">
                      {new Date(task.startDate).toLocaleDateString()} - {new Date(task.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Estimated Cost:</span>
                    <span className="font-medium">
                      PKR {task.estimatedCost.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{task.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Assigned to:</span>
                    <Badge variant="secondary">
                      {task.assignedTo}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => handleEditTask(task)}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDeleteTask(task._id)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {isModalOpen && (
        <TaskModal
          task={selectedTask}
          projectId={projectId!}
          phaseId={phaseId!}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
};

export default Tasks; 