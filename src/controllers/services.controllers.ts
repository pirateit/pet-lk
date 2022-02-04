import { Request, Response } from 'express';
import User from '../models/user';
import Service from '../models/service';

export const getAllServices = async (req: Request, res: Response) => {
  const user = req.user as User;

  res.render('requests', { reducedName: user.firstName ?? 'Без имени' });
};

export const registerService = async (req: Request, res: Response) => {
  const user = req.user as User;

  await Service.create({
    category: req.body.category,
    name: req.body.name,
    unit: req.body.unit,
    cost: req.body.cost,
  })

  res.render('requests', { reducedName: user.firstName ?? 'Без имени' });
}
