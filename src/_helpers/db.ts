import employeeModel from '../employees/employee.model';
import config from '../../config.json';
import mysql from 'mysql2/promise';
import {Sequelize} from 'sequelize';
import departmentModel from '../departments/department.model';
import requestItemModel from '../requestItems/requestItem.model';
import requestModel from '../requests/request.model';

export interface Database{
    sequelize: Sequelize;
    User:any;
    Employee:any;
    Department:any;
    Request: any;
    RequestItem: any;
}

export const db: Database = {} as Database;
export async function initialize(): Promise<void>{
    const {host, port, user, password, database} = config.database;

    //Create database if it doesn't exist
    const connection = await mysql.createConnection({host, port, user, password});
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    await connection.end();

    //Connect to database with Sequelize
    const sequelize = new Sequelize(database, user, password, {dialect : 'mysql'});
    db.sequelize = sequelize
    //Initialize models
    const {default: userModel} = await import('../users/user.model');
    db.User = userModel(sequelize);
    db.Employee = employeeModel(sequelize);
    db.Department = departmentModel(sequelize);
    db.Request = requestModel(sequelize);
    db.RequestItem = requestItemModel(sequelize)

    db.Employee.belongsTo(db.User, {foreignKey: 'userId'});
    db.Employee.belongsTo(db.Department, {foreignKey: 'deptId'});
    db.RequestItem.belongsTo(db.Request, {foreignKey: 'requestId'})

    await sequelize.sync({alter: true});

    console.log('Database initialized and models synced');

}

