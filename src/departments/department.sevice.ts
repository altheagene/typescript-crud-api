import { db } from "../_helpers/db";
import { Department, DepartmentCreationAttributes } from "./department.model";

export const departmentService = {
    getAll,
    getById,
    create,
    update,
    _delete
}

async function getAll(): Promise<Department[]>{
    return await db.Department.findAll();
}

async function getById(id:number): Promise<Department>{
    return await db.Department.findByPk(id)
}

async function create(params: DepartmentCreationAttributes): Promise<void>{
    await db.Department.create(params)
}

async function update(id: number, params: Partial<DepartmentCreationAttributes>) : Promise<void>{
    const department = await db.Department.findByPk(id);

    await department.update(
        {
            name: params.name,
            description: params.description
        }
    )
}

async function _delete(id: number): Promise<void> {
    const department = await db.Department.findByPk(id);

    if(!department) throw new Error('Department not found');
    await department.destroy();
}