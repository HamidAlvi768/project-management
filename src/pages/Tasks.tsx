import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, ArrowLeft, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageTitle } from '../components/ui/page-title';
import TaskModal from '../components/TaskModal';
import TaskInventoryList from '../components/TaskInventoryList';
import TaskInventoryModal from '../components/TaskInventoryModal';
import InventoryModal from '../components/InventoryModal';
import { taskApi, phaseApi, projectApi } from '../services/api';
import { ITask, ITaskInput, IPhase, IProject, ITaskInventoryInput, IInventoryInput } from '../services/types';
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchTasks, createTask, updateTask, deleteTask, setSelectedTask } from '@/store/slices/taskSlice';
import { fetchTaskInventory, addInventoryToTask, createInventory } from '@/store/slices/inventorySlice';
import { RootState } from '@/store/store';

// At the top of the file, add type guards
const ensureString = (value: any): string => {
  if (!value) {
    throw new Error('Value is required');
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'object' && value !== null && '_id' in value) {
    return value._id;
  }
  console.error('Invalid value type:', value);
  throw new Error(`Invalid value type: ${typeof value}`);
};

const Tasks: React.FC = () => {
  const { projectId, phaseId } = useParams<{ projectId: string; phaseId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { tasks, selectedTask, isLoading, error } = useAppSelector((state: RootState) => state.task);
  const [project, setProject] = useState<IProject | null>(null);
  const [phase, setPhase] = useState<IPhase | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [isNewInventoryModalOpen, setIsNewInventoryModalOpen] = useState(false);
  const { toast } = useToast();

  const taskInventory = useAppSelector((state: RootState) => 
    state.inventory.taskInventory[phaseId || ''] || []
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!projectId || !phaseId) {
        console.log('Missing projectId or phaseId:', { projectId, phaseId });
        return;
      }
      
      try {
        console.log('Fetching data for:', { projectId, phaseId });
        const [projectResponse, phaseResponse] = await Promise.all([
          projectApi.getOne(projectId),
          phaseApi.getOne(projectId, phaseId)
        ]);

        console.log('API responses:', {
          project: projectResponse.data,
          phase: phaseResponse.data
        });

        setProject(projectResponse.data.data);
        setPhase(phaseResponse.data.data);

        // Fetch tasks and inventory through Redux
        await Promise.all([
          dispatch(fetchTasks({ projectId, phaseId })).unwrap(),
          dispatch(fetchTaskInventory(phaseId)).unwrap()
        ]);
      } catch (error: any) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: error?.message || "Failed to fetch data",
          variant: "destructive"
        });
      }
    };

    fetchData();
  }, [dispatch, projectId, phaseId, toast]);

  // Add debug logs for state changes
  useEffect(() => {
    console.log('Project and phase state updated:', { project, phase });
  }, [project, phase]);

  // Log state changes
  useEffect(() => {
    console.log('Current tasks state:', { tasks, isLoading, error });
  }, [tasks, isLoading, error]);

  const handleAddTask = () => {
    dispatch(setSelectedTask(null));
    setIsModalOpen(true);
  };

  const handleEditTask = (task: ITask) => {
    dispatch(setSelectedTask(task));
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!projectId || !phaseId) return;
    
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await dispatch(deleteTask({ projectId, phaseId, taskId })).unwrap();
        toast({
          title: "Success",
          description: "Task deleted successfully",
        });
      } catch (error: any) {
        console.error('Error deleting task:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to delete task",
          variant: "destructive",
        });
      }
    }
  };

  const handleSaveTask = async (data: ITaskInput) => {
    if (!projectId || !phaseId) return;

    try {
      if (selectedTask) {
        await dispatch(updateTask({
          projectId,
          phaseId,
          taskId: selectedTask._id,
          data
        })).unwrap();
        toast({
          title: "Success",
          description: "Task updated successfully",
        });
      } else {
        await dispatch(createTask({ projectId, phaseId, data })).unwrap();
        toast({
          title: "Success",
          description: "Task created successfully",
        });
      }
      setIsModalOpen(false);
      dispatch(setSelectedTask(null));
    } catch (error: any) {
      console.error('Error saving task:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save task",
        variant: "destructive",
      });
    }
  };

  const handleAddInventory = async (data: ITaskInventoryInput) => {
    if (!projectId || !phaseId || !selectedTask || !project) return;

    try {
      console.log('Adding inventory with data:', {
        taskId: selectedTask._id,
        data: data
      });
      
      await dispatch(addInventoryToTask({ 
        taskId: selectedTask._id, 
        data: data
      })).unwrap();
      
      // Refresh the task inventory after adding
      await dispatch(fetchTaskInventory(selectedTask._id));
      
      setIsInventoryModalOpen(false);
      dispatch(setSelectedTask(null));
      toast({
        title: "Success",
        description: "Inventory added to task successfully",
      });
    } catch (error: any) {
      console.error('Error adding inventory to task:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add inventory to task",
        variant: "destructive",
      });
    }
  };

  const handleAddNewInventory = async (data: IInventoryInput) => {
    try {
      // First create the inventory item
      const newInventory = await dispatch(createInventory(data)).unwrap();
      
      // Then allocate it to the task
      if (selectedTask && project) {
        const taskInventoryData: ITaskInventoryInput = {
          task: selectedTask._id,
          phase: phaseId!,
          project: projectId!,
          customer: typeof project.customer === 'object' ? project.customer._id : project.customer,
          inventory: newInventory._id,
          allocatedValue: data.unitValue // Allocate the entire quantity by default
        };
        
        await dispatch(addInventoryToTask({ 
          taskId: selectedTask._id, 
          data: taskInventoryData
        })).unwrap();
        
        // Refresh the task inventory
        await dispatch(fetchTaskInventory(selectedTask._id));
      }
      
      setIsNewInventoryModalOpen(false);
      dispatch(setSelectedTask(null));
      toast({
        title: "Success",
        description: "Inventory created and allocated successfully",
      });
    } catch (error: any) {
      console.error('Error creating and allocating inventory:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create and allocate inventory",
        variant: "destructive",
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

  const getTaskCompletion = (status: string) => {
    switch (status) {
      case 'completed':
        return 100;
      case 'in-progress':
        return 50;
      case 'pending':
      default:
        return 0;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <PageTitle
          title={project && phase ? `Tasks - ${project.name} - ${phase.name}` : "Task Management"}
          leftContent={
            <Button variant="ghost" size="sm" onClick={() => navigate(`/projects/${projectId}/phases`)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Phases
            </Button>
          }
          rightContent={
            <Button disabled className="gap-2">
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          }
        />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <PageTitle
          title={project && phase ? `Tasks - ${project.name} - ${phase.name}` : "Task Management"}
          leftContent={
            <Button variant="ghost" size="sm" onClick={() => navigate(`/projects/${projectId}/phases`)}>
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
        <div className="text-center py-6 text-red-500">
          Error loading tasks: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageTitle
        title={project && phase ? `Tasks - ${project.name} - ${phase.name}` : "Task Management"}
        leftContent={
          <Button variant="ghost" size="sm" onClick={() => navigate(`/projects/${projectId}/phases`)}>
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

      {tasks.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          No tasks found. Click "Add Task" to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <Card key={task._id} className="flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold">{task.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Estimated Cost:</span>
                      <span className="font-medium">PKR {task.estimatedCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Timeline:</span>
                      <span className="font-medium">
                        {new Date(task.startDate).toLocaleDateString()} - {new Date(task.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <Badge variant="outline" className={getStatusColor(task.status)}>
                        {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Type:</span>
                      <Badge variant="outline" className={getTypeColor(task.type)}>
                        {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Assigned To:</span>
                      <Badge variant="secondary">{task.assignedTo}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2 w-full">
                <div className="grid grid-cols-2 gap-2 w-full">
                  <Button variant="outline" size="sm" onClick={() => {
                    console.log('Add New Inventory clicked:', {
                      selectedTask: task,
                      project,
                      projectCustomer: project?.customer
                    });
                    dispatch(setSelectedTask(task));
                    setIsNewInventoryModalOpen(true);
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => {
                    console.log('Allocate Inventory clicked:', {
                      selectedTask: task,
                      project,
                      projectCustomer: project?.customer
                    });
                    dispatch(setSelectedTask(task));
                    setIsInventoryModalOpen(true);
                  }}>
                    <Package className="h-4 w-4 mr-2" />
                    Allocate
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2 w-full">
                  <Button variant="outline" size="sm" onClick={() => handleEditTask(task)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteTask(task._id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {isNewInventoryModalOpen && (
        <InventoryModal
          onClose={() => {
            setIsNewInventoryModalOpen(false);
            dispatch(setSelectedTask(null));
          }}
          onSave={handleAddNewInventory}
        />
      )}

      {isInventoryModalOpen && selectedTask && project && (
        <TaskInventoryModal
          taskId={selectedTask._id}
          phaseId={ensureString(phaseId)}
          projectId={ensureString(projectId)}
          customerId={typeof project.customer === 'object' ? project.customer._id : project.customer}
          onClose={() => {
            setIsInventoryModalOpen(false);
            dispatch(setSelectedTask(null));
          }}
          onSave={handleAddInventory}
        />
      )}

      {isModalOpen && (
        <TaskModal
          task={selectedTask}
          projectId={ensureString(projectId)}
          phaseId={ensureString(phaseId)}
          onClose={() => {
            setIsModalOpen(false);
            dispatch(setSelectedTask(null));
          }}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
};

export default Tasks; 