import express from 'express';
import { taskController } from '../controllers/task.controller';
import { validate, commonValidations } from '../middleware/validate';
import { checkSchema } from 'express-validator';

const router = express.Router({ mergeParams: true });

// Task validation schema
const taskValidation = {
  create: checkSchema({
    name: commonValidations.requiredString('Task name'),
    estimatedCost: commonValidations.requiredNumber('Estimated cost'),
    startDate: commonValidations.requiredDate('Start date'),
    endDate: commonValidations.requiredDate('End date'),
    status: commonValidations.optionalEnum('Status', ['pending', 'in-progress', 'completed']),
    description: commonValidations.requiredString('Description'),
    type: commonValidations.requiredEnum('Type', ['construction', 'procurement', 'inspection']),
    assignedTo: commonValidations.requiredString('Assigned to'),
  }),
  update: checkSchema({
    name: commonValidations.optionalString('Task name'),
    estimatedCost: commonValidations.optionalNumber('Estimated cost'),
    startDate: commonValidations.optionalDate('Start date'),
    endDate: commonValidations.optionalDate('End date'),
    status: commonValidations.optionalEnum('Status', ['pending', 'in-progress', 'completed']),
    description: commonValidations.optionalString('Description'),
    type: commonValidations.optionalEnum('Type', ['construction', 'procurement', 'inspection']),
    assignedTo: commonValidations.optionalString('Assigned to'),
  }),
  status: checkSchema({
    status: commonValidations.requiredEnum('Status', ['pending', 'in-progress', 'completed']),
  }),
  assignedTo: checkSchema({
    assignedTo: commonValidations.requiredString('Assigned to'),
  }),
};

// Routes
router.route('/')
  .get(validate([
    checkSchema(commonValidations.pagination),
  ]), taskController.getAllForPhase)
  .post(validate([
    checkSchema({ phaseId: commonValidations.id('Phase ID') }),
    ...taskValidation.create,
  ]), taskController.create);

router.route('/:id')
  .get(validate([
    checkSchema({ id: commonValidations.id() }),
  ]), taskController.getOne)
  .patch(validate([
    checkSchema({ id: commonValidations.id() }),
    ...taskValidation.update,
  ]), taskController.update)
  .delete(validate([
    checkSchema({ id: commonValidations.id() }),
  ]), taskController.delete);

router.patch('/:id/status', validate([
  checkSchema({ id: commonValidations.id() }),
  ...taskValidation.status,
]), taskController.updateStatus);

router.patch('/:id/reassign', validate([
  checkSchema({ id: commonValidations.id() }),
  ...taskValidation.assignedTo,
]), taskController.reassign);

router.get('/stats/by-type', validate([
  checkSchema({ phaseId: commonValidations.id('Phase ID') }),
]), taskController.getStatsByType);

export default router; 