import { DataType, DataTypes, Model, Optional } from "sequelize";
import type {Sequelize} from 'sequelize';

export interface RequestAttributes{
    id: number;
    type: string;
    userId: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface RequestCreationAttributes
    extends Optional <RequestAttributes, 'id' | 'createdAt' |'updatedAt'> {}

export class Request
    extends Model<RequestAttributes, RequestCreationAttributes>
    implements RequestAttributes{
        public id!: number;
        public type!: string;
        public userId!: number;
        public status!: string;
        
        public readonly createdAt!: Date;
        public readonly updatedAt!: Date;

    }

export default function (sequelize : Sequelize) : typeof Request{
    Request.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {model: 'users', key: 'id'},
            allowNull: false,
            onDelete: 'CASCADE'
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    },{
        sequelize,
        modelName: 'Request',
        tableName: 'requests',
        timestamps: true
    })

    return Request;
}