import type {Request, Response, NextFunction} from 'express';
import {Router} from 'express';
import Joi, {valid} from 'joi';
import { validateRequest } from '../_middleware/validateRequest';
import { requestItemServices } from './requestItem.services';

const router = Router();

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);

export default router;

function getAll(req: Request, res: Response, next: NextFunction) : void{
    requestItemServices.getAll()
        .then(requestItems => res.json(requestItems))
        .catch(next);
};

function getById(req: Request, res: Response, next: NextFunction) : void{
    requestItemServices.getById(Number(req.params.id))
        .then(requestItem => res.json(requestItem))
        .catch(next)
}

function create(req: Request, res: Response, next: NextFunction) : void{
    requestItemServices.create(req.body)
        .then(() => res.json({'message' : 'Request Item created'}))
};

function update(req: Request, res: Response, next: NextFunction) : void{
    requestItemServices.update(Number(req.params.id), req.body)
        .then(() => res.json({'message' : 'Item updated'}))
}

function _delete(req: Request, res: Response, next: NextFunction) : void{
    requestItemServices._delete(Number(req.params.id))
        .then(() => res.json({'message' : 'Item deleted'}));
};

function createSchema(req: Request, res: Response, next: NextFunction) : void{
    const schema = Joi.object({
        requestId: Joi.number().required(),
        item: Joi.string().required(),
        quantity: Joi.number().required()
    });

    validateRequest(req, next, schema)
};

function updateSchema(req: Request, res: Response, next: NextFunction) : void{
    const schema = Joi.object({
        requestId: Joi.number().optional(),
        item: Joi.string().optional(),
        quantity: Joi.number().optional()
    })

    validateRequest(req, next, schema)
}