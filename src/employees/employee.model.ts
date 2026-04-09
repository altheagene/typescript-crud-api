import { DataTypes, Model, Optional } from "sequelize";
import type {Sequelize} from "sequelize";
import {User} from '../users/user.model';
import { Department } from "../departments/department.model";

export interface EmployeeAttributes{
    id: number,
    userId: number,
    position: string,
    deptId: number,
    hireDate: Date,
    createdAt: Date;
    updatedAt: Date;
}

export interface EmployeeCreationAttributes
    extends Optional <EmployeeAttributes, 'id' | 'createdAt' | 'updatedAt' > {}

export class Employee
    extends Model<EmployeeAttributes, EmployeeCreationAttributes>
    implements EmployeeAttributes{
        public id!:number;
        public userId!: number;
        public position!: string;
        public deptId!:number;
        public hireDate!: Date;

        public readonly createdAt!: Date;
        public readonly updatedAt!: Date;
    }

    //Export the initializer function
    export default function (sequelize : Sequelize) : typeof Employee{
        Employee.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true
                },
                userId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: { model: 'users', key: 'id' },
                    onDelete: 'CASCADE'
                },
                position: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                deptId:  {
                    type: DataTypes.INTEGER,
                    references: { model: 'departments', key: 'id' },
                    allowNull:false
                },
                hireDate: {
                    type: DataTypes.DATE,
                    allowNull: false
                },
                 createdAt: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: DataTypes.NOW
                },
                updatedAt: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: DataTypes.NOW
                }
            },
            {
                sequelize,
                modelName: 'Employee',
                tableName: 'employees',
                timestamps: true
            }
        )

        return Employee
    }

    