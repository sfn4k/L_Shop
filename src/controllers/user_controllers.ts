import { Request, Response } from "express";
import * as usersService from "../services/user_service";

export const getUsers = (req: Request, res: Response) => {
    const user=usersService.getUsers();
    res.json(user);
}
export const getUserById= (req: Request, res: Response) =>{
    const id=Number(req.params.id);
    const user=usersService.getUserById(id);
    res.json(user);
}
export const getUserByName= (req: Request, res: Response) =>{
    const name=String(req.query.name);
    const user=usersService.getUserByName(name);
    res.json(user);
}
export const registerUser=(req: Request, res:Response) =>{
    try{
    const { name, email, login, phone, password } = req.body;
    const user = usersService.registerUser(name, email, login, phone, password);
    res.cookie("userId", user.id, {httpOnly: true,maxAge: 10 * 60 * 1000});
    res.json(user);
    }
    catch(error){
        res.status(400).json({ message: "Пользователь уже существует "});
    }
}
export const verifyUser=(req:Request,res:Response)=>{
    const login=String(req.params.login);
    const userPassword=String(req.params.password);
    const user=usersService.verifyUser(login,userPassword);
    res.json(user);
}