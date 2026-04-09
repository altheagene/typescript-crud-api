import { db } from "../_helpers/db";
import { Request, RequestCreationAttributes} from "./request.model";

export const requestService ={
    getAll,
    getById,
    create,
    update,
    _delete
}

export interface requestWithItems extends RequestCreationAttributes{
    items: {item: string, quantity: number}[]
}

async function getAll(): Promise<Request[]>{
    return await db.Request.findAll();
}

async function getById(id: number): Promise<Request>{
    return await db.Request.findByPk(id);
}

async function create(params: requestWithItems) : Promise<void>{

    const t = await db.sequelize.transaction();
    const request = await db.Request.create({
        userId: params.userId,
        type: params.type,
        status: params.status
    },
    {
        transaction: t
    })

    for(const i of params.items){{
        await db.RequestItem.create({
            requestId: request.id,
            item: i.item,
            quantity: i.quantity
        },
        {transaction : t})
    }}

    await t.commit();
}


async function update(params: Partial <RequestCreationAttributes>) : Promise<void>{
    await db.Request.update({
        userId: params.userId,
        type: params.type,
        status: params.status
    })
}

async function _delete(id: number): Promise<void>{
    const request = await db.Request.findByPk(id);

    if(!request)
        throw new Error('Request not found!')

    await request.destroy();
}

