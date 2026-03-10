import fs from "fs";
import { User } from "../types/user";
import {Users_path} from "../constants/const";

export const getUsers =() =>{
    const file=fs.readFileSync(Users_path, "utf-8");
    const users:User[] = JSON.parse(file);
    return users;
}
export const getUserById=(id:number)=> {
    const file=fs.readFileSync(Users_path, "utf-8");
    const users:User[] = JSON.parse(file);
    const user = users.find((p)=>p.id===id);
    return user;
}

export const getUserByName=(name:string) =>{
    const file=fs.readFileSync(Users_path, "utf-8");
    const users:User[] = JSON.parse(file);
    const user = users.find((p)=>p.name===name);
    return user;
}

export const registerUser = (name: string,email: string,login: string,phone: string,password: string) => {
    const file = fs.readFileSync(Users_path, "utf-8");
    const users: User[] = JSON.parse(file);
    const existingUser = users.find(user=> user.login === login);
    
    if (existingUser) {
        throw new Error("Пользователь с таким логином уже существует");
    }
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newUser: User = {id: newId,name,email,login,phone,password};
    users.push(newUser);
    fs.writeFileSync(Users_path, JSON.stringify(users, null, 2));
    return newUser;
};