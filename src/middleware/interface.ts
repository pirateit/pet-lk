import { Request, Response, NextFunction } from 'express';
import { Op } from "sequelize";
import Srequest from "../models/srequest";
import User from "../models/user";
import { Role, userRole } from "../utils/user";

export interface CustomRequest extends Request {
  profile: {
    id: number;
    firstName?: String;
    role: Role;
    phoneNumber: string;
    discount: number;
  };
  stats?: Object;
}

export async function getUserData(req: CustomRequest, res: Response, next: NextFunction) {
  var userData = req.user as User;
  var user = {
    id: userData.id,
    firstName: userData.firstName,
    role: userRole(userData.role),
    phoneNumber: String(userData.phoneNumber).substring(1),
    discount: userData.discount,
  };

  var countRequests = await Srequest.count();
  var activeRequests = await Srequest.count({
    where: {
      status: {
        [Op.lt]: 3
      }
    }
  });
  var countUsers = await User.count();

  var stats = {
    countRequests,
    activeRequests,
    countUsers,
  };

  req.profile = user;
  req.stats = stats;

  return next();
}
