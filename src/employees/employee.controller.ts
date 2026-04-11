import type { Request, Response, NextFunction } from "express";
import { Router } from "express";
import Joi, {valid} from 'joi';
import { validateRequest } from "../_middleware/validateRequest";
import { employeeService } from "./employee.service";
import { authenticateToken, authorizeRole } from "../_middleware/auth";

const router = Router();

router.get('/', authenticateToken, authorizeRole('Admin'), getAll);
router.get('/:id',authenticateToken, authorizeRole('Admin'), getById);
router.post('/', createSchema,authenticateToken, authorizeRole('Admin') , create);
router.put('/:id', updateSchema, authenticateToken, authorizeRole('Admin') ,  update);
router.delete('/:id', authenticateToken, authorizeRole('Admin') ,  _delete);

 
export default router;


function getAll(req: Request, res: Response, next: NextFunction): void{
    employeeService.getAll()
        .then(employees => res.json(employees))
        .catch(next);
}

function getById(req: Request, res: Response, next: NextFunction): void{
    employeeService.getById(Number(req.params.id))
        .then(employee => res.json(employee))
        .catch(next);
}

function create(req: Request, res: Response, next: NextFunction):void{
    employeeService.create(req.body)
        .then(() => res.json({message: 'Employee created'}))
        .catch(next);
}

function update(req: Request, res: Response, next: NextFunction): void{
    employeeService.update(Number(req.params.id), req.body)
        .then(() => res.json({message: 'Employee updated'}))
}

function _delete(req: Request, res: Response, next: NextFunction):void{
    employeeService._delete(Number(req.params.id as string))
        .then(() => res.json({message: 'Employee deleted'}));
}

function createSchema(req: Request, res: Response, next: NextFunction):void{
    const schema = Joi.object({
        email: Joi.string().email().required(),
        position: Joi.string().required(),
        employeeId: Joi.string().required(),
        deptId: Joi.number().required(),
        hireDate: Joi.date().required()
    });

    validateRequest(req, next, schema);
}

function updateSchema(req: Request, res: Response, next: NextFunction): void{
    const schema = Joi.object({
        email: Joi.string().optional(),
        position: Joi.string().optional(),
        employeeId: Joi.string().optional(),
        deptId: Joi.number().optional(),
        hireDate: Joi.date().optional()
    });

    validateRequest(req, next, schema);
}
