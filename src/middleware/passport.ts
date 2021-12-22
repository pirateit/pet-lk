import { NextFunction, Request, Response } from "express";
import User from "../models/user";

export const checkAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) { return next() }
  res.status(401).redirect('/');
};

export const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User;
  if (user.role === 1) { return next() }
  res.status(401).redirect('/');
};
