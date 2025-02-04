import express from 'express';
import { phaseController } from '../controllers/phase.controller';
import { validate, commonValidations } from '../middleware/validate';
import { checkSchema, Location } from 'express-validator';
import { PHASE_STATUS_VALUES, PhaseStatus } from '../types/phase.types';

const router = express.Router({ mergeParams: true });

// Phase validation schema
const phaseValidation = {
  create: checkSchema({
    name: {
      in: ['body'] as Location[],
      isString: true,
      trim: true,
      notEmpty: { errorMessage: 'Phase name is required' },
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
          if (!PHASE_STATUS_VALUES.includes(value as PhaseStatus)) {
            throw new Error('Invalid phase status');
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
    laborCost: {
      in: ['body'] as Location[],
      optional: true,
      isFloat: true,
      toFloat: true,
    },
    materialCost: {
      in: ['body'] as Location[],
      optional: true,
      isFloat: true,
      toFloat: true,
    },
    equipmentCost: {
      in: ['body'] as Location[],
      optional: true,
      isFloat: true,
      toFloat: true,
    },
    dependencies: {
      in: ['body'] as Location[],
      optional: true,
      isArray: true,
      custom: {
        options: (value: string[]) => {
          if (!value) return true;
          return value.every(id => /^[0-9a-fA-F]{24}$/.test(id));
        },
        errorMessage: 'Dependencies must be an array of valid MongoDB IDs'
      }
    }
  }),
  update: checkSchema({
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
          if (!PHASE_STATUS_VALUES.includes(value as PhaseStatus)) {
            throw new Error('Invalid phase status');
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
    laborCost: {
      in: ['body'] as Location[],
      optional: true,
      isFloat: true,
      toFloat: true,
    },
    materialCost: {
      in: ['body'] as Location[],
      optional: true,
      isFloat: true,
      toFloat: true,
    },
    equipmentCost: {
      in: ['body'] as Location[],
      optional: true,
      isFloat: true,
      toFloat: true,
    }
  }),
  dependencies: checkSchema({
    dependencies: {
      in: ['body'] as Location[],
      isArray: true,
      custom: {
        options: (value: string[]) => {
          if (!value) return true;
          return value.every(id => /^[0-9a-fA-F]{24}$/.test(id));
        },
        errorMessage: 'Dependencies must be an array of valid MongoDB IDs'
      }
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
  })), phaseController.getAllForProject)
  .post(validate([
    checkSchema({
      projectId: {
        in: ['params'] as Location[],
        isMongoId: true,
        errorMessage: 'Invalid project ID'
      }
    }),
    phaseValidation.create
  ]), phaseController.create);

router.route('/:id')
  .get(validate(checkSchema({
    id: {
      in: ['params'] as Location[],
      isMongoId: true,
      errorMessage: 'Invalid phase ID'
    }
  })), phaseController.getOne)
  .patch(validate([
    checkSchema({
      id: {
        in: ['params'] as Location[],
        isMongoId: true,
        errorMessage: 'Invalid phase ID'
      }
    }),
    phaseValidation.update
  ]), phaseController.update)
  .delete(validate(checkSchema({
    id: {
      in: ['params'] as Location[],
      isMongoId: true,
      errorMessage: 'Invalid phase ID'
    }
  })), phaseController.delete);

router.get('/:id/cost-breakdown', validate(checkSchema({
  id: {
    in: ['params'] as Location[],
    isMongoId: true,
    errorMessage: 'Invalid phase ID'
  }
})), phaseController.getCostBreakdown);

router.patch('/:id/dependencies', validate([
  checkSchema({
    id: {
      in: ['params'] as Location[],
      isMongoId: true,
      errorMessage: 'Invalid phase ID'
    }
  }),
  phaseValidation.dependencies
]), phaseController.updateDependencies);

export default router; 