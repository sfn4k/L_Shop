import fs from "fs";
import crypto from "node:crypto";

import { PublicUser, SessionRecord, User } from "../types/user";
import { Session_time, Sessions_path, Users_path } from "../constants/const";

const readUsersFile = (): User[] => {
    if (!fs.existsSync(Users_path)) {
        return [];
    }

    const file = fs.readFileSync(Users_path, "utf-8").trim();

    if (!file) {
        return [];
    }

    const users:User[] = JSON.parse(file);
    return users;
}

const readSessionsFile = (): SessionRecord[] => {
    if (!fs.existsSync(Sessions_path)) {
        return [];
    }

    const file = fs.readFileSync(Sessions_path, "utf-8").trim();

    if (!file) {
        return [];
    }

    const sessions: SessionRecord[] = JSON.parse(file);
    return sessions;
}

const writeSessionsFile = (sessions: SessionRecord[]) => {
    fs.writeFileSync(Sessions_path, JSON.stringify(sessions, null, 2));
}

export const getUsers =() =>{
    const users = readUsersFile();
    return users;
}
export const getUserById=(id:number)=> {
    const users = readUsersFile();
    const user = users.find((p)=>p.id===id);
    return user;
}

export const getUserByName=(name:string) =>{
    const users = readUsersFile();
    const user = users.find((p)=>p.name===name);
    return user;
}

export const registerUser = (name: string,email: string,login: string,phone: string,password: string) => {
    const users = readUsersFile();
    const existingUser = users.find(user=> user.login === login);
    if (existingUser) {
        throw new Error("Пользователь с таким логином уже существует");
    }
    let newId = 1;
    if (users.length > 0) {
        let maxId = users[0].id;
        for (const user of users) {
            if (user.id > maxId) {
                maxId = user.id;
            }
        }
        newId = maxId + 1;
    }
    const newUser: User = {id: newId,name,email,login,phone,password};
    users.push(newUser);
    fs.writeFileSync(Users_path, JSON.stringify(users, null, 2));
    return newUser;
};
export const verifyUser=(userLogin:string,userPassword:string) => {
    const users = readUsersFile();
    const user = users.find(item=> item.login === userLogin);
    if(user==undefined){
         throw new Error("Данный пользователь не существует");
    }
    if(user.password !== userPassword){
        throw new Error("Пароль не совпадает");
    }
    return user;
}

export const toPublicUser = (user: User): PublicUser => {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        login: user.login,
        phone: user.phone,
    };
}

export const createSession = (userId: number): SessionRecord => {
    const now = Date.now();
    const sessions = readSessionsFile();
    const actualSessions: SessionRecord[] = [];
    for (const sessionItem of sessions) {
        const expiresAt = new Date(sessionItem.expiresAt).getTime();
        if (expiresAt > now) {
            actualSessions.push(sessionItem);
        }
    }
    if (sessions.length !== actualSessions.length) {
        writeSessionsFile(actualSessions);
    }
    const session: SessionRecord = {
        token: crypto.randomUUID(),
        userId,
        expiresAt: new Date(Date.now() + Session_time).toISOString(),
    };
    actualSessions.push(session);
    writeSessionsFile(actualSessions);
    return session;
}

export const getSessionByToken = (token: string): SessionRecord | null => {
    const now = Date.now();
    const sessions = readSessionsFile();
    const actualSessions: SessionRecord[] = [];
    for (const sessionItem of sessions) {
        const expiresAt = new Date(sessionItem.expiresAt).getTime();
        if (expiresAt > now) {
            actualSessions.push(sessionItem);
        }
    }
    if (sessions.length !== actualSessions.length) {
        writeSessionsFile(actualSessions);
    }
    for (const session of actualSessions) {
        if (session.token === token) {
            return session;
        }
    }
    return null;
}

export const destroySession = (token: string) => {
    const sessions = readSessionsFile();
    const actualSessions: SessionRecord[] = [];
    for (const session of sessions) {
        if (session.token !== token) {
            actualSessions.push(session);
        }
    }
    writeSessionsFile(actualSessions);
}
