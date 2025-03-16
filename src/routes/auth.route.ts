import { Router } from "express";
import { registerHandler, loginHandler, logoutHandler, refreshHandler, verifyEmailHandler, sendPasswordResetHandler, ResetPasswordHandler, checkUsernameHandler } from "../controllers/auth.controller";   

const authRoutes = Router();

// prefix: /auth

authRoutes.post('/register', registerHandler)
authRoutes.post('/login', loginHandler)
authRoutes.get('/logout', logoutHandler)
authRoutes.get('/refresh', refreshHandler)
authRoutes.get('/email/verify/:code', verifyEmailHandler)
authRoutes.post('/password/forgot', sendPasswordResetHandler)
authRoutes.post('/password/reset', ResetPasswordHandler)

authRoutes.post('/check', checkUsernameHandler)

export default authRoutes;