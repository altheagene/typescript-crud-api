import { db } from "../_helpers/db";
import { RequestItem, RequestItemCreationAttributes } from "requestItems/requestItem.model";

export const requestItemServices = {
    getAll,
    getById,
    create,
    update,
    _delete
}

async function getAll(): Promise<RequestItem[]> {
   return await db.RequestItem.findAll();
}

async function getById(id:number) : Promise<RequestItem> {
    return await db.RequestItem.findByPk(id);
}

async function create(params : RequestItemCreationAttributes) : Promise<void> {
    await db.RequestItem.create({
        requestId: params.requestId,
        item: params.item,
        quantity: params.quantity
    });
}

async function update(id:number, params : Partial <RequestItemCreationAttributes>) : Promise<void> {
    await db.RequestItem.update({
        requestId: params.requestId,
        item: params.item,
        quantity: params.quantity
    })
}

async function _delete(id: number) : Promise<void> {
    const requestItem = await db.RequestItem.findByPk(id);

    if(!requestItem) throw new Error('Item not found');

    await requestItem.destroy()
}

