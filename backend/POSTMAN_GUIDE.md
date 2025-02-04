# API Testing Guide with Postman

This guide provides examples for testing all endpoints of the Project Management System API using Postman.

## Setup

1. Download and install [Postman](https://www.postman.com/downloads/)
2. Import the environment variables:
   ```json
   {
     "base_url": "http://localhost:5000/api",
     "project_id": "",
     "phase_id": "",
     "task_id": ""
   }
   ```

## Project Endpoints

### 1. Create Project
- **Method**: POST
- **URL**: `{{base_url}}/projects`
- **Body** (raw JSON):
```json
{
  "name": "Commercial Complex Alpha",
  "estimatedBudget": 1500000,
  "startDate": "2024-02-01",
  "endDate": "2024-12-31",
  "status": "ongoing",
  "description": "A 10-story commercial building with underground parking",
  "stakeholders": ["John Architect", "Sarah Engineer", "Mike Contractor"]
}
```
- **Expected Response** (201 Created):
```json
{
  "status": "success",
  "data": {
    "id": "...",
    "name": "Commercial Complex Alpha",
    "estimatedBudget": 1500000,
    "actualCost": 0,
    "startDate": "2024-02-01T00:00:00.000Z",
    "endDate": "2024-12-31T00:00:00.000Z",
    "status": "ongoing",
    "description": "A 10-story commercial building with underground parking",
    "completion": 0,
    "stakeholders": ["John Architect", "Sarah Engineer", "Mike Contractor"],
    "phaseCount": 0,
    "taskCount": 0,
    "budgetVariance": 0,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### 2. Get All Projects
- **Method**: GET
- **URL**: `{{base_url}}/projects`
- **Query Parameters**:
  - `page`: 1 (optional)
  - `limit`: 10 (optional)
  - `status`: ongoing (optional)
  - `search`: commercial (optional)
  - `sort`: -createdAt (optional)

### 3. Get Project by ID
- **Method**: GET
- **URL**: `{{base_url}}/projects/{{project_id}}`

### 4. Update Project
- **Method**: PATCH
- **URL**: `{{base_url}}/projects/{{project_id}}`
- **Body** (raw JSON):
```json
{
  "status": "completed",
  "completion": 100
}
```

### 5. Delete Project
- **Method**: DELETE
- **URL**: `{{base_url}}/projects/{{project_id}}`

### 6. Get Project Timeline
- **Method**: GET
- **URL**: `{{base_url}}/projects/{{project_id}}/timeline`

### 7. Get Project Statistics
- **Method**: GET
- **URL**: `{{base_url}}/projects/stats`

## Phase Endpoints

### 1. Create Phase
- **Method**: POST
- **URL**: `{{base_url}}/projects/{{project_id}}/phases`
- **Body** (raw JSON):
```json
{
  "name": "Foundation Work",
  "estimatedBudget": 250000,
  "startDate": "2024-02-01",
  "endDate": "2024-03-15",
  "status": "in-progress",
  "description": "Excavation and foundation laying for the main building",
  "laborCost": 100000,
  "materialCost": 140000,
  "equipmentCost": 20000,
  "dependencies": []
}
```

### 2. Get All Phases for Project
- **Method**: GET
- **URL**: `{{base_url}}/projects/{{project_id}}/phases`
- **Query Parameters**:
  - `page`: 1 (optional)
  - `limit`: 10 (optional)
  - `status`: in-progress (optional)
  - `search`: foundation (optional)
  - `sort`: startDate (optional)

### 3. Get Phase by ID
- **Method**: GET
- **URL**: `{{base_url}}/phases/{{phase_id}}`

### 4. Update Phase
- **Method**: PATCH
- **URL**: `{{base_url}}/phases/{{phase_id}}`
- **Body** (raw JSON):
```json
{
  "status": "completed",
  "completion": 100,
  "actualCost": 260000
}
```

### 5. Delete Phase
- **Method**: DELETE
- **URL**: `{{base_url}}/phases/{{phase_id}}`

### 6. Get Phase Cost Breakdown
- **Method**: GET
- **URL**: `{{base_url}}/phases/{{phase_id}}/cost-breakdown`

### 7. Update Phase Dependencies
- **Method**: PATCH
- **URL**: `{{base_url}}/phases/{{phase_id}}/dependencies`
- **Body** (raw JSON):
```json
{
  "dependencies": ["phase_id_1", "phase_id_2"]
}
```

## Task Endpoints

### 1. Create Task
- **Method**: POST
- **URL**: `{{base_url}}/phases/{{phase_id}}/tasks`
- **Body** (raw JSON):
```json
{
  "name": "Foundation Excavation",
  "estimatedCost": 75000,
  "startDate": "2024-02-01",
  "endDate": "2024-02-15",
  "status": "in-progress",
  "description": "Excavation of foundation area according to architectural plans",
  "type": "construction",
  "assignedTo": "John Construction Team"
}
```

### 2. Get All Tasks for Phase
- **Method**: GET
- **URL**: `{{base_url}}/phases/{{phase_id}}/tasks`
- **Query Parameters**:
  - `page`: 1 (optional)
  - `limit`: 10 (optional)
  - `status`: in-progress (optional)
  - `type`: construction (optional)
  - `assignedTo`: John Construction Team (optional)
  - `search`: excavation (optional)
  - `sort`: startDate (optional)

### 3. Get Task by ID
- **Method**: GET
- **URL**: `{{base_url}}/tasks/{{task_id}}`

### 4. Update Task
- **Method**: PATCH
- **URL**: `{{base_url}}/tasks/{{task_id}}`
- **Body** (raw JSON):
```json
{
  "status": "completed",
  "estimatedCost": 80000
}
```

### 5. Delete Task
- **Method**: DELETE
- **URL**: `{{base_url}}/tasks/{{task_id}}`

### 6. Update Task Status
- **Method**: PATCH
- **URL**: `{{base_url}}/tasks/{{task_id}}/status`
- **Body** (raw JSON):
```json
{
  "status": "completed"
}
```

### 7. Reassign Task
- **Method**: PATCH
- **URL**: `{{base_url}}/tasks/{{task_id}}/reassign`
- **Body** (raw JSON):
```json
{
  "assignedTo": "Sarah Construction Team"
}
```

### 8. Get Task Statistics by Type
- **Method**: GET
- **URL**: `{{base_url}}/phases/{{phase_id}}/tasks/stats/by-type`

## Testing Flow Example

1. Create a project and save the returned `project_id`
2. Create multiple phases for the project using the `project_id`
3. For each phase, save its `phase_id` and create multiple tasks
4. Update task statuses and observe how it affects phase completion
5. Update phase statuses and observe how it affects project completion
6. Test the statistics endpoints to see aggregated data
7. Test the timeline endpoint to see the project structure
8. Test deletion (tasks → phases → project) to ensure proper cleanup

## Common HTTP Status Codes

- 200: Successful GET, PATCH
- 201: Successful POST (resource created)
- 204: Successful DELETE
- 400: Bad Request (validation error)
- 404: Resource Not Found
- 500: Server Error

## Error Response Example
```json
{
  "status": "error",
  "message": "Invalid input data. Start date must be before end date"
}
```

## Tips

1. Use environment variables in Postman to store frequently used values
2. After creating a resource, store its ID in the environment variables
3. Test validation by sending invalid data
4. Test error handling by requesting non-existent resources
5. Use the collection runner to automate testing sequences
6. Check response headers and status codes
7. Verify that related resources are updated correctly
8. Test pagination by creating multiple resources
9. Test search functionality with various criteria
10. Test sorting with different fields and directions 