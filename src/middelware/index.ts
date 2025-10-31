import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export const handleInputError = (req:Request, res:Response, next:NextFunction) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() }); //.status(400) codigo http usado para errores 'bad request' result.array() para guardar los errores en un array
  }

  next()

};
