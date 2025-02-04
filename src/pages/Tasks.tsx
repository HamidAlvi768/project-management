import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import TaskModal from '../components/TaskModal';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageTitle } from '../components/ui/page-title';

interface Task {
  id: number;
  name: string;
  estimatedCost: number;
  startDate: string;
  endDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  description: string;
  type: 'construction' | 'procurement' | 'inspection';
  assignedTo: string;
}

const Tasks: React.FC = () => {
  const { projectId, phaseId } = useParams<{ projectId: string; phaseId: string }>();
  const navigate = useNavigate();

  const [phaseName, setPhaseName] = useState<string>("");

  useEffect(() => {
    const phase = [
      { id: 1, name: "Foundation Work" },
      { id: 2, name: "Structural Framework" }
    ].find(p => p.id === Number(phaseId));
    
    if (phase) {
      setPhaseName(phase.name);
    }
  }, [phaseId]);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      name: "Foundation Excavation",
      estimatedCost: 75000,
      startDate: "2024-02-01",
      endDate: "2024-02-15",
      status: "in-progress",
      description: "Excavation of foundation area according to architectural plans",
      type: "construction",
      assignedTo: "John Construction Team"
    },
    {
      id: 2,
      name: "Purchase Construction Materials",
      estimatedCost: 150000,
      startDate: "2024-02-10",
      endDate: "2024-02-20",
      status: "pending",
      description: "Procurement of cement, steel, and other construction materials",
      type: "procurement",
      assignedTo: "Sarah Procurement"
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: Task['type']) => {
    switch (type) {
      case 'construction':
        return 'bg-orange-100 text-orange-800';
      case 'procurement':
        return 'bg-purple-100 text-purple-800';
      case 'inspection':
        return 'bg-teal-100 text-teal-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddTask = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = (taskId: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(t => t.id !== taskId));
    }
  };

  const handleSaveTask = (taskData: Omit<Task, 'id'>) => {
    if (selectedTask) {
      // Edit existing task
      setTasks(tasks.map(t => 
        t.id === selectedTask.id 
          ? { ...taskData, id: selectedTask.id }
          : t
      ));
    } else {
      // Add new task
      const newTask = {
        ...taskData,
        id: Math.max(0, ...tasks.map(t => t.id)) + 1
      };
      setTasks([...tasks, newTask]);
    }
  };

  return (
    <div className="space-y-6">
      <PageTitle
        title={`${phaseName} Tasks`}
        leftContent={
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">Project ID: {projectId}</p>
            <p className="text-sm text-muted-foreground">Phase ID: {phaseId}</p>
          </div>
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
          <Card key={task.id}>
            <CardHeader className="pb-2 text-center">
              <CardTitle className="text-xl font-bold">{task.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Cost:</span>
                    <span className="font-medium">${task.estimatedCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Start Date:</span>
                    <span className="font-medium">{new Date(task.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">End Date:</span>
                    <span className="font-medium">{new Date(task.endDate).toLocaleDateString()}</span>
                  </div>
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
                    <span className="text-sm text-muted-foreground">Assigned To:</span>
                    <span className="font-medium">{task.assignedTo}</span>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">{task.description}</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <div className="flex gap-2 w-full">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  onClick={() => handleEditTask(task)}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        task={selectedTask}
      />
    </div>
  );
};

export default Tasks; 