import { db } from "../_helpers/db";
import { Employee, EmployeeCreationAttributes } from "./employee.model";

export const employeeService = {
    getAll,
    getById,
    create,
    update,
    _delete
}

interface CreateEmployeeParams {
    email: string;
    employeeId: string;
    position: string;
    deptId: number;
    hireDate: Date;
}

async function getAll(): Promise<Employee[]>{
    return await db.Employee.findAll({
        include:[db.User, db.Department]
    });
}

async function getById(id : number):Promise<Employee | null>{
    return await Employee.findByPk(id);
}

async function create(params : CreateEmployeeParams):Promise<void>{

    //check if this email is associated with an existing user
    const user = await db.User.findOne({where: {email : params.email}})

    if(!user){
         throw new Error('User with this email does not exist');
    }

    //check if this user is already in the employees table
    const employee = await db.Employee.findOne({ where: { userId: user.id } });

    if(employee){
        throw new Error('User with this email does not exist');
    }

    await db.Employee.create({
        userId: user.id,
        employeeId: params.employeeId,
        position: params.position,
        deptId: params.deptId,
        hireDate: params.hireDate
    })
}

async function update(id: number, params: Partial <CreateEmployeeParams>): Promise<void>{
    const employee = await db.Employee.findByPk(id);

    //find user with corresponding email in params

    const user = await db.User.findOne({where: {id: employee.userId}});
    console.log(user)
    //update employee
    await employee.update({
      ...params
    })
    
}

async function _delete(id:number) : Promise<void>{
    const employee = await db.Employee.findByPk(id);
    if (!employee) throw new Error('Employee not found');
    await employee.destroy();
}