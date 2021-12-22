import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user';
import Srequest from '../models/srequest';
import Service from '../models/service';
import { statusColor } from '../middleware/request';

export const getProfile = async (req: Request, res: Response) => {
  const user = req.user as User;

  res.render('profile', { reducedName: user.firstName ?? 'Клиент', user: user });
};

export const updateUser = async (req: Request, res: Response) => {
  const userData = req.body;
  userData.phoneNumber = userData.phoneNumber.replace(/[\s()\-\+]/g, '');

  if (!userData.firstName) {
    userData.firstName = null;
  }

  userData.password = await bcrypt.hash(userData.password, 10);

  await User.update(userData, {
    where: {
      id: req.params.id
    }
  });

  res.status(204).redirect('/profile');
};

export const deleteUser = async (req: Request, res: Response) => {
  const user = req.user as User;

  if (user.id !== Number(req.params.id)) {
    return res.sendStatus(403);
  }

  await User.destroy({
    where: {
      id: user.id
    }
  });

  res.status(307).redirect('/');
};

export const getUsers = async (req: Request, res: Response) => {
  const user = req.user as User;

  const users = await User.findAll({ attributes: ['id', 'firstName', 'phoneNumber']});

  res.render('admin/users', { title: 'Пользователи', reducedName: user.firstName ?? 'Клиент', users });
};

export const getUser = async (req: Request, res: Response) => {
  const user = req.user as User;
  const userId = req.params.id;

  const userData = await User.findByPk(userId, { attributes: ['id', 'firstName', 'phoneNumber']});
  const requestsData = await Srequest.findAll({ where: { userId: userId }, include: [{
    model: Service,
    as: 'service',
    attributes: ['name', 'unit']
  }, {
    model: User,
    as:'specialist',
    attributes: ['firstName']
  }]});

  const requests = requestsData.map(request => {
    const formattedDate = `${request.createdAt.toLocaleDateString()} ${request.createdAt.toTimeString().slice(0, 5)}`;

    return {
      id: request.id,
      createdAt: formattedDate,
      name: request.service.name,
      unit: request.service.unit,
      count: request.count,
      cost: request.cost,
      total: request.total,
      status: statusColor(request.status)
    };
  });

  res.render('admin/user', { reducedName: user.firstName ?? 'Клиент', user: userData, requests });
};
