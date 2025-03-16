import { Router } from "express";
import { getUserHandler, getAllUsersHandler,searchUsernameOrEmail } from "../controllers/user.controller";
import { addNewMessage, getMessages } from "../controllers/message.controller";

const userRoutes = Router();

//prefix: /user

userRoutes.get('/',getUserHandler);
userRoutes.get('/all',getAllUsersHandler);
userRoutes.post('/messages',addNewMessage);
userRoutes.get('/messages/:id',getMessages);
userRoutes.post('/search',searchUsernameOrEmail);

export default userRoutes;