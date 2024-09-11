import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import { NextFunction, Request, Response } from "express";

export function validationBodyMiddleware(type: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(type, req.body);

    try {
      await validateOrReject(dto);
      next();
    } catch (errors) {
      return res.status(422).json({
        message: "Validation Failed",
        code: "validation_failed",
        errors: errors,
      });
    }
  };
}
