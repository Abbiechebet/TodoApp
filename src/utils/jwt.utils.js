import jwt from "jsonwebtoken"
import pkg from "jsonwebtoken"
import {config} from "../config/index.js"

const { verify } = pkg;

export function generateToken(user){
  const payload = {
    _id: user._id,
    email: user.email,
    username: user.username
  }
  const token = jwt.sign(payload, config.jwt_secret_key, { expiresIn: 60 * 60 * 24 });
  return token 
}


export function verifyToken(token){
 return jwt,verify(token, config.jwt_secret_key)
}