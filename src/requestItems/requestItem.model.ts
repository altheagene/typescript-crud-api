import { DataTypes, Model, Optional } from "sequelize";
import type {Sequelize} from "sequelize";

export interface RequestItemAttributes{
    id: number;
    requestId: number;
    item: string;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface RequestItemCreationAttributes
    extends Optional <RequestItemAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class RequestItem
    extends Model<RequestItemAttributes, RequestItemCreationAttributes>
    implements RequestItemAttributes{
        public id!: number;
        public requestId!: number;
        public item!: string;
        public quantity!: number;
        public createdAt!: Date;
        public updatedAt!: Date;
    }

export default function (sequelize : Sequelize): typeof RequestItem{
    RequestItem.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        requestId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {model: 'requests', key: 'id'},
            onDelete: 'CASCADE'
        },
        item: {
            type: DataTypes.STRING,
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
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
    },
    {
        sequelize,
        modelName: 'RequestItem',
        tableName: 'request_items',
        timestamps: true
    });

    return RequestItem;
}