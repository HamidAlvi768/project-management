import express from 'express';
import { taskController } from '../controllers/task.controller';
import { validate, commonValidations } from '../middleware/validate';
import { checkSchema, Location } from 'express-validator';
import { TASK_STATUS_VALUES, TaskStatus, TASK_TYPE_VALUES, TaskType } from '../types/task.types';

const router = express.Router({ mergeParams: true });

// Task validation schema
const taskValidation = {
  create: checkSchema({
    name: {
      in: ['body'] as Location[],
      isString: true,
      trim: true,
      notEmpty: { errorMessage: 'Task name is required' },
    },
    estimatedCost: {
      in: ['body'] as Location[],
      isFloat: { errorMessage: 'Estimated cost must be a number' },
      toFloat: true,
    },
    startDate: {
      in: ['body'] as Location[],
      isISO8601: { errorMessage: 'Invalid start date format' },
      toDate: true,
    },
    endDate: {
      in: ['body'] as Location[],
      isISO8601: { errorMessage: 'Invalid end date format' },
      toDate: true,
    },
    status: {
      in: ['body'] as Location[],
      optional: true,
      isString: true,
      custom: {
        options: (value: string) => {
          if (!value) return true;
          if (!TASK_STATUS_VALUES.includes(value as TaskStatus)) {
            throw new Error('Invalid task status');
          }
          return true;
        }
      }
    },
    description: {
      in: ['body'] as Location[],
      isString: true,
      trim: true,
      notEmpty: { errorMessage: 'Description is required' },
    },
    type: {
      in: ['body'] as Location[],
      isString: true,
      custom: {
        options: (value: string) => {
          if (!TASK_TYPE_VALUES.includes(value as TaskType)) {
            throw new Error('Invalid task type');
          }
          return true;
        }
      }
    },
    assignedTo: {
      in: ['body'] as Location[],
      isString: true,
      trim: true,
      notEmpty: { errorMessage: 'Task must be assigned to someone' },
    }
  }),
  update: checkSchema({
    name: {
      in: ['body'] as Location[],
      optional: true,
      isString: true,
      trim: true,
    },
    estimatedCost: {
      in: ['body'] as Location[],
      optional: true,
      isFloat: true,
      toFloat: true,
    },
    startDate: {
      in: ['body'] as Location[],
      optional: true,
      isISO8601: true,
      toDate: true,
    },
    endDate: {
      in: ['body'] as Location[],
      optional: true,
      isISO8601: true,
      toDate: true,
    },
    status: {
      in: ['body'] as Location[],
      optional: true,
      isString: true,
      custom: {
        options: (value: string) => {
          if (!value) return true;
          if (!TASK_STATUS_VALUES.includes(value as TaskStatus)) {
            throw new Error('Invalid task status');
          }
          return true;
        }
      }
    },
    description: {
      in: ['body'] as Location[],
      optional: true,
      isString: true,
      trim: true,
    },
    type: {
      in: ['body'] as Location[],
      optional: true,
      isString: true,
      custom: {
        options: (value: string) => {
          if (!value) return true;
          if (!TASK_TYPE_VALUES.includes(value as TaskType)) {
            throw new Error('Invalid task type');
          }
          return true;
        }
      }
    },
    assignedTo: {
      in: ['body'] as Location[],
      optional: true,
      isString: true,
      trim: true,
    }
  }),
  status: checkSchema({
    status: {
      in: ['body'] as Location[],
      isString: true,
      custom: {
        options: (value: string) => {
          if (!TASK_STATUS_VALUES.includes(value as TaskStatus)) {
            throw new Error('Invalid task status');
          }
          return true;
        }
      }
    }
  }),
  assignedTo: checkSchema({
    assignedTo: {
      in: ['body'] as Location[],
      isString: true,
      trim: true,
      notEmpty: { errorMessage: 'Task must be assigned to someone' },
    }
  })
};

// Routes
router.route('/')
  .get(validate(checkSchema({
    page: {
      in: ['query'] as Location[],
      optional: true,
      isInt: { options: { min: 1 } },
      toInt: true,
    },
    limit: {
      in: ['query'] as Location[],
      optional: true,
      isInt: { options: { min: 1, max: 100 } },
      toInt: true,
    }
  })), taskController.getAllForPhase)
  .post(validate([
    checkSchema({
      phaseId: {
        in: ['params'] as Location[],
        isMongoId: true,
        errorMessage: 'Invalid phase ID'
      }
    }),
    taskValidation.create
  ]), taskController.create);

router.route('/:id')
  .get(validate(checkSchema({
    id: {
      in: ['params'] as Location[],
      isMongoId: true,
      errorMessage: 'Invalid task ID'
    }
  })), taskController.getOne)
  .patch(validate([
    checkSchema({
      id: {
        in: ['params'] as Location[],
        isMongoId: true,
        errorMessage: 'Invalid task ID'
      }
    }),
    taskValidation.update
  ]), taskController.update)
  .delete(validate(checkSchema({
    id: {
      in: ['params'] as Location[],
      isMongoId: true,
      errorMessage: 'Invalid task ID'
    }
  })), taskController.delete);

router.patch('/:id/status', validate([
  checkSchema({
    id: {
      in: ['params'] as Location[],
      isMongoId: true,
      errorMessage: 'Invalid task ID'
    }
  }),
  taskValidation.status
]), taskController.updateStatus);

router.patch('/:id/reassign', validate([
  checkSchema({
    id: {
      in: ['params'] as Location[],
      isMongoId: true,
      errorMessage: 'Invalid task ID'
    }
  }),
  taskValidation.assignedTo
]), taskController.reassign);

router.get('/stats/by-type', validate(checkSchema({
  phaseId: {
    in: ['params'] as Location[],
    isMongoId: true,
    errorMessage: 'Invalid phase ID'
  }
})), taskController.getStatsByType);

export default router; 