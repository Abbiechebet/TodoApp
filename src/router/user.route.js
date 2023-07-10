import express from 'express';
import UserController from '../controller/user.controller.js'
import { tryCatchHandler } from '../utils/tryCatch.handler.js'

// Setting up our User router
const router = new express.Router()

// User Creation Route
router.post("/create", tryCatchHandler( UserController.createUser) )
router.get("/", tryCatchHandler( UserController.findUser) )
router.post("/login", tryCatchHandler( UserController.loginUser) )
router.post("/forgot-password", tryCatchHandler( UserController.userForgotPassword) )
router.post("/reset-password/:userId/:token", tryCatchHandler( UserController.userResetPassword) )


//Exporting the User Router
export { router }

// export const obj = { name: "james" }

// export function callName(){
//   console.log("Calling ", obj.name)
// }