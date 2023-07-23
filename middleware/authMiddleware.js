
import jwt from 'jsonwebtoken'
import {BadRequestError , UnauthenticatedError} from '../errors/index.js'


export const authenticateUser = (req, res, next) => {
    const { token } = req.cookies;
    if (!token) throw new UnauthenticatedError('authentication invalid');
  
    try {
      let decoded = jwt.verify(token,process.env.JWT_SECRET)
      const {userId,email,name,role} = decoded
      let testUser = userId === '64bbc3012e91ba5e168c89cb'
      req.user = {userId,email,name,role,testUser}
      next();
    } catch (error) {
      throw new UnauthenticatedError('authentication invalid');
    }
  };
  

export const checkForTestUser = (req,res,next) => {
  if(req.user.testUser) {
    throw new BadRequestError('Demo User. Read Only')
  }
  next()
}