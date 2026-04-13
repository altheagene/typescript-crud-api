import bcrypt from 'bcryptjs';
import { db } from '../_helpers/db';
import { Role } from '../_helpers/role';
import { User, UserCreationAttributes } from './user.model';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config()

const JWT_SECRET  = 'myS3cr3tk3y'

export const userService = {
    getAll,
    getById,
    getByEmail,
    create,
    update,
    delete: _delete,
    login,
    verify,
    resetPassword
};

interface LoginParams{
    email: string;
    password: string;
}

interface VerifyEmail{
    email:string;
}

async function login(params : LoginParams): Promise<{token: string, user: object}>{
    const user = await db.User.findOne({where : {email : params.email}, attributes: ['passwordHash', 'email', 'role', 'id']});

    if(!user) throw new Error('Email or password incorrect')
    
    if(!await bcrypt.compare(params.password, user.passwordHash)){
        throw new Error('Email or password incorrect');
    }

    const token = jwt.sign(
        {id: user.id, email: user.email, role: user.role},
        JWT_SECRET,
        {expiresIn: '1h'}
    )

    console.log('hi')

    return {token : token, user: {id: user.id, email: user.email, role: user.role}}
}

async function verify(params : VerifyEmail): Promise<void>{
    
    //find user with that email
    const user = await db.User.findOne({where: {email: params.email}});

    if(!user) throw new Error('User not found');

    await user.update({
        verified: true
    })
}

async function getAll(): Promise<User[]> {
    return await db.User.findAll();
}

async function getById(id : number) : Promise<User> {
    return await getUser(id);
}

async function getByEmail(email : string) : Promise<User> {
    return await db.User.findOne({where : {email : email}});
}

async function create(params: UserCreationAttributes & {password:string}) : Promise<void> {

    //Check if email already exists
    const existingUser = await db.User.findOne({where : {email: params.email }});
    if(existingUser) {
        throw new Error(`Email "${params.email}" is already registered`);
    }

    //Hash password
    const passwordHash = await bcrypt.hash(params.password, 10);

    //Create user (exclude password from saved fields)
    await db.User.create({
        ...params,
        passwordHash,
        role: params.role || Role.User,
        verified: params.verified || false
    } as UserCreationAttributes);
}

async function update(id : number, params: Partial <UserCreationAttributes> & {password?: string}) : Promise<void> {
    const user = await getUser(id);

    //Hash new password if provided
    if(params.password) {
        params.passwordHash = await bcrypt.hash(params.password, 10);
        delete params.password;
    }
    
    //Update user
    await user.update(params as Partial<UserCreationAttributes>);
}

async function resetPassword(id:number, newPassword : string) : Promise<void> {
    const user = await db.User.findByPk(id)

    const newHashed = await bcrypt.hash(newPassword, 10);
    await user.update({
        passwordHash: newHashed
    })

}

async function _delete(id: number) : Promise<void> {
    const user = await getUser(id);
    await user.destroy();
}

//Helper: Get user or throw error
async function getUser(id: number) : Promise<User> {
    const user = await db.User.scope('withHash').findByPk(id);
    if(!user){
        throw new Error('User not found');
    }

    return user;
}