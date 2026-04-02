import fs from "fs";
import crypto from "node:crypto";

import { PublicUser, SessionRecord, User } from "../types/user";
import { Session_time, Sessions_path, Users_path } from "../constants/const";

/**
 * Читает JSON-файл с пользователями.
 *
 * @returns {User[]} Список пользователей.
 */
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
};

/**
 * Читает JSON-файл с активными сессиями.
 *
 * @returns {SessionRecord[]} Список сессий.
 */
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
};

/**
 * Сохраняет список сессий в JSON-файл.
 *
 * @param {SessionRecord[]} sessions Актуальный список сессий.
 * @returns {void}
 */
const writeSessionsFile = (sessions: SessionRecord[]): void => {
    fs.writeFileSync(Sessions_path, JSON.stringify(sessions, null, 2));
};

/**
 * Возвращает всех пользователей из хранилища.
 *
 * @returns {User[]} Список пользователей.
 */
export const getUsers =(): User[] =>{
    const users = readUsersFile();
    return users;
};

/**
 * Ищет пользователя по идентификатору.
 *
 * @param {number} id Идентификатор пользователя.
 * @returns {User | undefined} Найденный пользователь или `undefined`.
 */
export const getUserById=(id:number): User | undefined => {
    const users = readUsersFile();
    const user = users.find((p)=>p.id===id);
    return user;
};

/**
 * Ищет пользователя по имени.
 *
 * @param {string} name Имя пользователя.
 * @returns {User | undefined} Найденный пользователь или `undefined`.
 */
export const getUserByName=(name:string): User | undefined =>{
    const users = readUsersFile();
    const user = users.find((p)=>p.name===name);
    return user;
};

/**
 * Регистрирует нового пользователя в хранилище.
 *
 * @param {string} name Имя пользователя.
 * @param {string} email Email пользователя.
 * @param {string} login Уникальный логин пользователя.
 * @param {string} phone Контактный телефон пользователя.
 * @param {string} password Пароль пользователя.
 * @returns {User} Созданный пользователь.
 * @throws {Error} Если пользователь с таким логином уже существует.
 */
export const registerUser = (name: string,email: string,login: string,phone: string,password: string): User => {
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

/**
 * Проверяет логин и пароль пользователя.
 *
 * @param {string} userLogin Логин пользователя.
 * @param {string} userPassword Пароль пользователя.
 * @returns {User} Найденный пользователь.
 * @throws {Error} Если пользователь не найден или пароль неверный.
 */
export const verifyUser=(userLogin:string,userPassword:string): User => {
    const users = readUsersFile();
    const user = users.find(item=> item.login === userLogin);
    if(user==undefined){
         throw new Error("Данный пользователь не существует");
    }
    if(user.password !== userPassword){
        throw new Error("Пароль не совпадает");
    }
    return user;
};

/**
 * Скрывает приватные поля пользователя перед отправкой на клиент.
 *
 * @param {User} user Пользователь из хранилища.
 * @returns {PublicUser} Публичное представление пользователя.
 */
export const toPublicUser = (user: User): PublicUser => {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        login: user.login,
        phone: user.phone,
    };
};

/**
 * Создает новую сессию пользователя и удаляет просроченные записи.
 *
 * @param {number} userId Идентификатор пользователя.
 * @returns {SessionRecord} Созданная сессия.
 */
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
};

/**
 * Возвращает активную сессию по токену и очищает просроченные записи.
 *
 * @param {string} token Токен сессии.
 * @returns {SessionRecord | null} Найденная активная сессия или `null`.
 */
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
};

/**
 * Удаляет сессию по токену.
 *
 * @param {string} token Токен сессии.
 * @returns {void}
 */
export const destroySession = (token: string): void => {
    const sessions = readSessionsFile();
    const actualSessions: SessionRecord[] = [];
    for (const session of sessions) {
        if (session.token !== token) {
            actualSessions.push(session);
        }
    }
    writeSessionsFile(actualSessions);
};
