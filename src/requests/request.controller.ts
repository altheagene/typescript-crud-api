import type {Request, Response, NextFunction} from 'express';
import {Router} from 'express';
import Joi, {valid} from 'joi';
import { validateRequest } from '../_middleware/validateRequest';
import { requestService } from './request.service';
import { Status } from '../_helpers/status';
import { authorizeRole, authenticateToken } from '../_middleware/auth';

const router = Router();

router.get('/', authenticateToken,getAll);
router.get('/:id', authenticateToken, getById);
router.get('/users/:id', authenticateToken, getByUserId)
router.post('/', createSchema,authenticateToken, create);
router.put('/',  updateSchema, authenticateToken, update);
router.delete('/:id',authenticateToken, _delete);

export default router;

function getByUserId(req: Request, res: Response, next: NextFunction) : void{
    requestService.getByUserId(Number(req.params.id))
        .then(requests => res.json(requests))
        .catch(next)
};

function getAll(req: Request, res: Response, next: NextFunction) : void{
    requestService.getAll()
        .then(requests => res.json(requests))
        .catch(next)
};

function getById(req: Request, res: Response, next: NextFunction) : void{
    requestService.getById(Number(req.params.id))
        .then(request => res.json(request))
        .catch(next);
};

function create(req: Request, res: Response, next: NextFunction) : void{
    requestService.create(req.body)
        .then(() => res.json({'message' : 'Request Created'}))
}

function update(req: Request, res: Response, next: NextFunction) : void{
    requestService.update(req.body)
        .then(() => res.json({'message' : 'Request updated'}))
}

function _delete(req: Request, res: Response, next: NextFunction) : void{
    requestService._delete(Number(req.params.id))
        .then(() => res.json({'message' : 'Request deleted'}))
}

function createSchema(req: Request, res: Response, next: NextFunction) : void{
    const schema = Joi.object({
        type: Joi.string().required(),
        userId: Joi.number().required(),
        status: Joi.string().valid(Status.Pending, Status.Approved, Status.Disapproved).default(Status.Pending).required(),
        items: Joi.array().required()
    });

    validateRequest(req, next, schema);
}

function updateSchema(req: Request, res: Response, next: NextFunction) : void{
    const schema = Joi.object({
        type: Joi.string().optional(),
        userId: Joi.number().optional(),
        status: Joi.string().valid(Status.Pending, Status.Approved, Status.Disapproved).empty('')
    });

    validateRequest(req, next, schema);
}

