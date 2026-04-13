import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET  = 'myS3cr3tk3y'

export function authenticateToken(  req: Request,res: Response,next: NextFunction){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err:any, user:any) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }

        (req as any).user = user;
        next();
    });
}

export function authorizeRole(role: string) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!(req as any).user || (req as any).user.role !== role) {
            return res.status(403).json({
                error: 'Access denied'
            });
        }

        next();
    };
}