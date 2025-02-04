import express from 'express';
import { phaseController } from '../controllers/phase.controller';
import { validate, commonValidations } from '../middleware/validate';
import { checkSchema } from 'express-validator';

const router = express.Router({ mergeParams: true });

// Phase validation schema
const phaseValidation = {
  create: checkSchema({
    name: commonValidations.requiredString('Phase name'),
    estimatedBudget: commonValidations.requiredNumber('Estimated budget'),
    startDate: commonValidations.requiredDate('Start date'),
    endDate: commonValidations.requiredDate('End date'),
    status: commonValidations.optionalEnum('Status', ['not-started', 'in-progress', 'completed']),
    description: commonValidations.requiredString('Description'),
    laborCost: commonValidations.optionalNumber('Labor cost'),
    materialCost: commonValidations.optionalNumber('Material cost'),
    equipmentCost: commonValidations.optionalNumber('Equipment cost'),
    dependencies: commonValidations.optionalArray('Dependencies'),
  }),
  update: checkSchema({
    name: commonValidations.optionalString('Phase name'),
    estimatedBudget: commonValidations.optionalNumber('Estimated budget'),
    startDate: commonValidations.optionalDate('Start date'),
    endDate: commonValidations.optionalDate('End date'),
    status: commonValidations.optionalEnum('Status', ['not-started', 'in-progress', 'completed']),
    description: commonValidations.optionalString('Description'),
    laborCost: commonValidations.optionalNumber('Labor cost'),
    materialCost: commonValidations.optionalNumber('Material cost'),
    equipmentCost: commonValidations.optionalNumber('Equipment cost'),
  }),
  dependencies: checkSchema({
    dependencies: {
      ...commonValidations.requiredArray('Dependencies'),
      custom: {
        options: (value: string[]) => {
          return value.every(id => /^[0-9a-fA-F]{24}$/.test(id));
        },
        errorMessage: 'Dependencies must be an array of valid MongoDB IDs',
      },
    },
  }),
};

// Routes
router.route('/')
  .get(validate([
    checkSchema(commonValidations.pagination),
  ]), phaseController.getAllForProject)
  .post(validate([
    checkSchema({ projectId: commonValidations.id('Project ID') }),
    ...phaseValidation.create,
  ]), phaseController.create);

router.route('/:id')
  .get(validate([
    checkSchema({ id: commonValidations.id() }),
  ]), phaseController.getOne)
  .patch(validate([
    checkSchema({ id: commonValidations.id() }),
    ...phaseValidation.update,
  ]), phaseController.update)
  .delete(validate([
    checkSchema({ id: commonValidations.id() }),
  ]), phaseController.delete);

router.get('/:id/cost-breakdown', validate([
  checkSchema({ id: commonValidations.id() }),
]), phaseController.getCostBreakdown);

router.patch('/:id/dependencies', validate([
  checkSchema({ id: commonValidations.id() }),
  ...phaseValidation.dependencies,
]), phaseController.updateDependencies);

export default router; 