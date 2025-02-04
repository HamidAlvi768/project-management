import express from 'express';
import { projectController } from '../controllers/project.controller';
import { validate, commonValidations } from '../middleware/validate';
import { checkSchema, Location } from 'express-validator';
import { PROJECT_STATUS_VALUES, ProjectStatus } from '../types/project.types';

const router = express.Router();

// Project validation schema
const projectValidation = {
  create: checkSchema({
    name: {
      in: ['body'] as Location[],
      isString: true,
      trim: true,
      notEmpty: { errorMessage: 'Project name is required' },
    },
    estimatedBudget: {
      in: ['body'] as Location[],
      isFloat: { errorMessage: 'Estimated budget must be a number' },
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
          if (!PROJECT_STATUS_VALUES.includes(value as ProjectStatus)) {
            throw new Error('Invalid project status');
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
    stakeholders: {
      in: ['body'] as Location[],
      optional: true,
      isArray: true,
    }
  }),
  update: {
    name: {
      in: ['body'] as Location[],
      optional: true,
      isString: true,
      trim: true,
    },
    estimatedBudget: {
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
          if (!PROJECT_STATUS_VALUES.includes(value as ProjectStatus)) {
            throw new Error('Invalid project status');
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
    stakeholders: {
      in: ['body'] as Location[],
      optional: true,
      isArray: true,
    }
  }
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
  })), projectController.getAll)
  .post(validate(projectValidation.create), projectController.create);

router.route('/:id')
  .get(validate(checkSchema({
    id: {
      in: ['params'] as Location[],
      isMongoId: true,
      errorMessage: 'Invalid project ID'
    }
  })), projectController.getOne)
  .patch(validate(checkSchema({
    id: {
      in: ['params'] as Location[],
      isMongoId: true,
      errorMessage: 'Invalid project ID'
    },
    ...projectValidation.update
  })), projectController.update)
  .delete(validate(checkSchema({
    id: {
      in: ['params'] as Location[],
      isMongoId: true,
      errorMessage: 'Invalid project ID'
    }
  })), projectController.delete);

router.get('/:id/timeline', validate(checkSchema({
  id: {
    in: ['params'] as Location[],
    isMongoId: true,
    errorMessage: 'Invalid project ID'
  }
})), projectController.getTimeline);

router.get('/stats', projectController.getStats);

export default router; 