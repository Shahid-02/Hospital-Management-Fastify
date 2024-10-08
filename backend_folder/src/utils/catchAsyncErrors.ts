import { Request, Response, NextFunction } from "express";

export const catchAsyncErrors = (
  theFunction: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(theFunction(req, res, next)).catch(next);
  };
};
