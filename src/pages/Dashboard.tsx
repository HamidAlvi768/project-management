import React from 'react';
import { Users, Building2, ListTodo, GitMerge } from 'lucide-react';
import { SummaryCard } from "@/components/dashboard/summary-card";
import { ComparisonBarChart } from '@/components/charts/ComparisonBarChart';

// Temporary mock data - replace with actual data from your API
const mockProjectTimeData = [
  { 
    name: 'DHA10MARLA1',
    estimatedTime: 90,
    actualTime: 85
  },
  { 
    name: '15 marla dha house',
    estimatedTime: 85,
    actualTime: 0  // Project not started/in progress
  }
];

const mockProjectCostData = [
  { 
    name: 'DHA10MARLA1',
    estimatedCost: 5000000,
    actualCost: 4500000
  },
  { 
    name: '15 marla dha house',
    estimatedCost: 4800000,
    actualCost: 0  // Project not started/in progress
  }
];

// Mock data for ongoing projects and their phases
const mockOngoingProjects = [
  {
    id: 1,
    name: 'DHA10MARLA1',
    status: 'ongoing',
    phases: [
      { 
        name: 'Foundation',
        estimatedTime: 30,
        actualTime: 32
      },
      { 
        name: 'Structure',
        estimatedTime: 45,
        actualTime: 40
      },
      { 
        name: 'Finishing',
        estimatedTime: 25,
        actualTime: 20
      }
    ]
  },
  {
    id: 2,
    name: '15 marla dha house',
    status: 'ongoing',
    phases: [
      { 
        name: 'Foundation',
        estimatedTime: 25,
        actualTime: 28
      },
      { 
        name: 'Structure',
        estimatedTime: 40,
        actualTime: 35
      },
      { 
        name: 'Finishing',
        estimatedTime: 20,
        actualTime: 0  // Not started yet
      }
    ]
  }
];

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your project management statistics
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Total Customers"
          value="12"
          icon={<Users className="h-7 w-7" />}
          type="customers"
          trend={{ value: 12, isPositive: true }}
        />
        <SummaryCard
          title="Total Projects"
          value="25"
          icon={<Building2 className="h-7 w-7" />}
          type="invoices"
          trend={{ value: 8, isPositive: true }}
        />
        <SummaryCard
          title="Total Phases"
          value="89"
          icon={<GitMerge className="h-7 w-7" />}
          type="estimates"
          trend={{ value: 24, isPositive: true }}
        />
        <SummaryCard
          title="Total Tasks"
          value="234"
          icon={<ListTodo className="h-7 w-7" />}
          type="amount"
          trend={{ value: 18, isPositive: true }}
        />
      </div>

      <div className="flex flex-row gap-4">
        <ComparisonBarChart
          title="Project Time Comparison - Current Month"
          data={mockProjectTimeData}
          estimatedKey="estimatedTime"
          actualKey="actualTime"
          yAxisLabel="Days"
          className="flex-1"
          colorScheme="blue"
        />
        <ComparisonBarChart
          title="Project Cost Comparison - Current Month"
          data={mockProjectCostData}
          estimatedKey="estimatedCost"
          actualKey="actualCost"
          yAxisLabel="Cost (Millions)"
          className="flex-1"
          formatValue
          currencyPrefix="Rs."
          colorScheme="green"
        />
      </div>

      <div>
        <h3 className="text-2xl font-bold tracking-tight mb-4">Phase Time Comparison by Project</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockOngoingProjects.map(project => (
            <ComparisonBarChart
              key={project.id}
              title={`${project.name} - Phase Time Comparison`}
              data={project.phases}
              estimatedKey="estimatedTime"
              actualKey="actualTime"
              yAxisLabel="Days"
              className="w-full"
              colorScheme="purple"
            />
          ))}
        </div>
      </div>
    </div>
  );
}; 