import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { format } from 'date-fns';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import FormDialog from './ui/form-dialog';

interface Phase {
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
  dependencies: number[];
}

interface PhaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (phase: Omit<Phase, 'id' | 'taskCount' | 'budgetVariance'>) => void;
  phase: Phase | null;
}

const PhaseModal: React.FC<PhaseModalProps> = ({ isOpen, onClose, onSave, phase }) => {
  const [formData, setFormData] = React.useState<Omit<Phase, 'id' | 'taskCount' | 'budgetVariance'>>({
    name: '',
    estimatedBudget: 0,
    actualCost: 0,
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    status: 'not-started',
    description: '',
    completion: 0,
    laborCost: 0,
    materialCost: 0,
    equipmentCost: 0,
    dependencies: []
  });

  const [errors, setErrors] = React.useState<{
    costs?: string;
    dates?: string;
  }>({});

  // Validate costs whenever they change
  React.useEffect(() => {
    const totalCostBreakdown = formData.laborCost + formData.materialCost + formData.equipmentCost;
    
    if (totalCostBreakdown !== formData.actualCost) {
      setErrors(prev => ({
        ...prev,
        costs: `Cost breakdown total ($${totalCostBreakdown.toLocaleString()}) does not match actual cost ($${formData.actualCost.toLocaleString()})`
      }));
    } else {
      setErrors(prev => {
        const { costs, ...rest } = prev;
        return rest;
      });
    }
  }, [formData.laborCost, formData.materialCost, formData.equipmentCost, formData.actualCost]);

  // Validate dates whenever they change
  React.useEffect(() => {
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    
    if (endDate < startDate) {
      setErrors(prev => ({
        ...prev,
        dates: 'End date cannot be earlier than start date'
      }));
    } else {
      setErrors(prev => {
        const { dates, ...rest } = prev;
        return rest;
      });
    }
  }, [formData.startDate, formData.endDate]);

  React.useEffect(() => {
    if (phase) {
      const { id, taskCount, budgetVariance, ...rest } = phase;
      setFormData(rest);
    } else {
      setFormData({
        name: '',
        estimatedBudget: 0,
        actualCost: 0,
        startDate: format(new Date(), 'yyyy-MM-dd'),
        endDate: format(new Date(), 'yyyy-MM-dd'),
        status: 'not-started',
        description: '',
        completion: 0,
        laborCost: 0,
        materialCost: 0,
        equipmentCost: 0,
        dependencies: []
      });
    }
  }, [phase]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate before submitting
    const totalCostBreakdown = formData.laborCost + formData.materialCost + formData.equipmentCost;
    if (totalCostBreakdown !== formData.actualCost) {
      return; // Don't submit if costs don't match
    }

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    if (endDate < startDate) {
      return; // Don't submit if dates are invalid
    }

    onSave(formData);
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const numberFields = ['laborCost', 'materialCost', 'equipmentCost', 'estimatedBudget', 'actualCost', 'completion'];
    
    setFormData(prev => {
      const newValue = numberFields.includes(name) ? Number(value) : value;
      const newData = { ...prev, [name]: newValue };

      // If updating any cost breakdown field, update actual cost automatically
      if (['laborCost', 'materialCost', 'equipmentCost'].includes(name)) {
        const otherCosts = ['laborCost', 'materialCost', 'equipmentCost']
          .filter(cost => cost !== name)
          .reduce((sum, cost) => sum + (prev[cost as keyof typeof prev] as number), 0);
        newData.actualCost = otherCosts + Number(value);
      }

      // If updating actual cost, distribute the difference proportionally
      if (name === 'actualCost') {
        const currentTotal = prev.laborCost + prev.materialCost + prev.equipmentCost;
        if (currentTotal > 0) {
          const ratio = Number(value) / currentTotal;
          newData.laborCost = Math.round(prev.laborCost * ratio);
          newData.materialCost = Math.round(prev.materialCost * ratio);
          newData.equipmentCost = Math.round(prev.equipmentCost * ratio);
          
          // Adjust for rounding errors
          const diff = Number(value) - (newData.laborCost + newData.materialCost + newData.equipmentCost);
          newData.laborCost += diff;
        }
      }

      return newData;
    });
  };

  const handleStatusChange = (value: Phase['status']) => {
    setFormData(prev => ({
      ...prev,
      status: value,
      completion: value === 'completed' ? 100 : prev.completion
    }));
  };

  return (
    <FormDialog 
      isOpen={isOpen} 
      onClose={onClose}
      title={phase ? 'Edit Phase' : 'Add New Phase'}
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Display validation errors */}
        {(errors.costs || errors.dates) && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {errors.costs && <div>{errors.costs}</div>}
              {errors.dates && <div>{errors.dates}</div>}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Phase Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not-started">Not Started</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              required
              className={errors.dates ? 'border-red-500' : ''}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              required
              className={errors.dates ? 'border-red-500' : ''}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="estimatedBudget">Estimated Budget ($)</Label>
            <Input
              type="number"
              id="estimatedBudget"
              name="estimatedBudget"
              value={formData.estimatedBudget}
              onChange={handleInputChange}
              min="0"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="actualCost">Actual Cost ($)</Label>
            <Input
              type="number"
              id="actualCost"
              name="actualCost"
              value={formData.actualCost}
              onChange={handleInputChange}
              min="0"
              required
              className={errors.costs ? 'border-red-500' : ''}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="laborCost">Labor Cost ($)</Label>
            <Input
              type="number"
              id="laborCost"
              name="laborCost"
              value={formData.laborCost}
              onChange={handleInputChange}
              min="0"
              required
              className={errors.costs ? 'border-red-500' : ''}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="materialCost">Material Cost ($)</Label>
            <Input
              type="number"
              id="materialCost"
              name="materialCost"
              value={formData.materialCost}
              onChange={handleInputChange}
              min="0"
              required
              className={errors.costs ? 'border-red-500' : ''}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="equipmentCost">Equipment Cost ($)</Label>
            <Input
              type="number"
              id="equipmentCost"
              name="equipmentCost"
              value={formData.equipmentCost}
              onChange={handleInputChange}
              min="0"
              required
              className={errors.costs ? 'border-red-500' : ''}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="completion">Completion (%)</Label>
          <Input
            type="number"
            id="completion"
            name="completion"
            value={formData.completion}
            onChange={handleInputChange}
            min="0"
            max="100"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="submit"
            variant="default"
            disabled={Object.keys(errors).length > 0}
          >
            {phase ? 'Update Phase' : 'Create Phase'}
          </Button>
        </div>
      </form>
    </FormDialog>
  );
};

export default PhaseModal; 