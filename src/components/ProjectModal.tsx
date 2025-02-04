import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FormDialog from './ui/form-dialog';

interface Project {
  id: number;
  name: string;
  estimatedBudget: number;
  startDate: string;
  endDate: string;
  status: 'ongoing' | 'completed' | 'on-hold';
  description: string;
}

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Omit<Project, 'id'>) => void;
  project?: Project | null;
}

const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  onSave,
  project
}) => {
  const [formData, setFormData] = useState<Omit<Project, 'id'>>({
    name: '',
    estimatedBudget: 0,
    startDate: '',
    endDate: '',
    status: 'ongoing',
    description: ''
  });

  useEffect(() => {
    if (project) {
      setFormData(project);
    } else {
      setFormData({
        name: '',
        estimatedBudget: 0,
        startDate: '',
        endDate: '',
        status: 'ongoing',
        description: ''
      });
    }
  }, [project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <FormDialog 
      isOpen={isOpen} 
      onClose={onClose}
      title={project ? 'Edit Project' : 'Add New Project'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Project Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="budget">Estimated Budget ($)</Label>
          <Input
            id="budget"
            type="number"
            value={formData.estimatedBudget}
            onChange={(e) => setFormData({ ...formData, estimatedBudget: Number(e.target.value) })}
            required
            min="0"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData({ ...formData, status: value as Project['status'] })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="on-hold">On Hold</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            required
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="default">
            {project ? 'Save Changes' : 'Create Project'}
          </Button>
        </div>
      </form>
    </FormDialog>
  );
};

export default ProjectModal; 