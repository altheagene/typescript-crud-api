import type { Request, Response, NextFunction } from 'express';
import { Router } from 'express';
import Joi, { valid } from 'joi';
import { Role } from '../_helpers/role';
import { validateRequest } from '../_middleware/validateRequest';
import { userService } from './user.service';

const router = Router();

//routes
router.get('/', getAll);
router.get('/:id', getById);
router.get('/email/:email', getByEmail);
router.post('/login', login);
router.post('/verify', verify);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);


export default router;

function login(req: Request, res: Response, next: NextFunction): void{
    userService.login(req.body)
        .then(data => res.json(data))
        .catch(next)
}

function verify(req: Request, res: Response, next: NextFunction): void {
    userService.verify(req.body)
        .then(() => res.json({ message: 'User verified' }))
        .catch(next);
}

function getAll(req: Request, res: Response, next: NextFunction): void {
    userService.getAll()
    .then((users) => res.json(users))
    .catch(next);
}

function getById(req: Request, res: Response, next: NextFunction): void {
    userService.getById(Number(req.params.id))
    .then((user) => res.json(user))
    .catch(next);
}

function getByEmail(req: Request, res: Response, next: NextFunction): void {
    userService.getByEmail(req.params.email as string)
    .then((user) => res.json(user))
    .catch(next);
}

function create(req: Request, res: Response, next: NextFunction): void {
    userService.create(req.body)
    .then(() => res.json({message : 'User created'}))
    .catch(next);
}

function update(req: Request, res: Response, next: NextFunction): void {
    userService.update(Number(req.params.id), req.body)
    .then(() => res.json({message: 'User updated'}))
    .catch(next);
}

function _delete(req: Request, res: Response, next: NextFunction): void{
    userService.delete(Number(req.params.id))
    .then(() => res.json({message: 'User deleted'}))
    .catch(next);
}

function createSchema(req: Request, res: Response, next: NextFunction): void{
    const schema = Joi.object({
        title: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        role: Joi.string().valid(Role.Admin, Role.User).default(Role.User),
        email: Joi.string().email().required(),
        verify: Joi.boolean().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
    });
    validateRequest(req, next, schema);
}

function updateSchema(req: Request, res: Response, next: NextFunction): void {
    const schema = Joi.object({
        title: Joi.string().empty(''),
        firstName: Joi.string().empty(''),
        lastName: Joi.string().empty(''),
        role: Joi.string().valid(Role.Admin, Role.User).empty(''),
        email: Joi.string().email().empty(''),
        verified: Joi.boolean().empty(''),
        password: Joi.string().min(6).empty(''),
        confirmPassword: Joi.string().valid(Joi.ref('password')).empty(''),
    }).with('password', 'confirmPassword');
    validateRequest(req, next, schema);
}