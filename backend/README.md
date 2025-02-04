# Project Management System - Backend API

A robust RESTful API built with Node.js, Express, TypeScript, and MongoDB for managing construction projects, phases, and tasks.

## Features

- **Project Management**: Create, read, update, and delete construction projects
- **Phase Management**: Manage project phases with dependencies and cost tracking
- **Task Management**: Track tasks within phases with status updates and assignments
- **Cost Tracking**: Monitor budgets, actual costs, and variances at all levels
- **Statistics**: Get detailed statistics and cost breakdowns
- **Timeline View**: Visualize project timelines with phases and tasks

## Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB with Mongoose
- Express Validator
- JWT Authentication (prepared for implementation)
- Helmet for security
- CORS support
- Morgan for logging

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a .env file based on .env.example:
   ```bash
   cp .env.example .env
   ```
5. Update the environment variables in .env

## Development

Start the development server:
```bash
npm run dev
```

The server will start on http://localhost:5000 (or the port specified in .env)

## Build

Compile TypeScript to JavaScript:
```bash
npm run build
```

## Production

Start the production server:
```bash
npm start
```

## API Endpoints

### Projects

- GET /api/projects - Get all projects (with pagination)
- POST /api/projects - Create a new project
- GET /api/projects/:id - Get a specific project
- PATCH /api/projects/:id - Update a project
- DELETE /api/projects/:id - Delete a project
- GET /api/projects/:id/timeline - Get project timeline
- GET /api/projects/stats - Get project statistics

### Phases

- GET /api/projects/:projectId/phases - Get all phases for a project
- POST /api/projects/:projectId/phases - Create a new phase
- GET /api/phases/:id - Get a specific phase
- PATCH /api/phases/:id - Update a phase
- DELETE /api/phases/:id - Delete a phase
- GET /api/phases/:id/cost-breakdown - Get phase cost breakdown
- PATCH /api/phases/:id/dependencies - Update phase dependencies

### Tasks

- GET /api/phases/:phaseId/tasks - Get all tasks for a phase
- POST /api/phases/:phaseId/tasks - Create a new task
- GET /api/tasks/:id - Get a specific task
- PATCH /api/tasks/:id - Update a task
- DELETE /api/tasks/:id - Delete a task
- PATCH /api/tasks/:id/status - Update task status
- PATCH /api/tasks/:id/reassign - Reassign task
- GET /api/phases/:phaseId/tasks/stats/by-type - Get task statistics by type

## Data Models

### Project
- name (string)
- estimatedBudget (number)
- actualCost (number)
- startDate (date)
- endDate (date)
- status ('ongoing' | 'completed' | 'on-hold')
- description (string)
- completion (number)
- stakeholders (string[])
- phaseCount (number)
- taskCount (number)
- budgetVariance (number)

### Phase
- project (reference)
- name (string)
- estimatedBudget (number)
- actualCost (number)
- startDate (date)
- endDate (date)
- status ('not-started' | 'in-progress' | 'completed')
- description (string)
- completion (number)
- taskCount (number)
- budgetVariance (number)
- laborCost (number)
- materialCost (number)
- equipmentCost (number)
- dependencies (reference[])

### Task
- phase (reference)
- name (string)
- estimatedCost (number)
- startDate (date)
- endDate (date)
- status ('pending' | 'in-progress' | 'completed')
- description (string)
- type ('construction' | 'procurement' | 'inspection')
- assignedTo (string)

## Error Handling

The API uses a centralized error handling mechanism with proper HTTP status codes and error messages.

## Validation

Input validation is implemented using express-validator with comprehensive validation rules for all endpoints.

## Security

- Helmet.js for security headers
- CORS configuration
- Input validation
- Error handling
- Prepared for JWT authentication

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the ISC License. 