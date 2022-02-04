import { Response } from 'express';
import { CustomRequest } from '../middleware/interface';
import bcrypt from 'bcrypt';
import User from '../models/user';
import Srequest from '../models/srequest';
import Service from '../models/service';
import { statusColor } from '../middleware/request';
import { userRole } from '../utils/user';
import { convertTime } from '../middleware/time';

export async function getProfile(req: CustomRequest, res: Response) {
  if (req.profile.role.id === 1) {
    return res.render('profile', { title: 'Мой профиль', user: req.profile, stats: req.stats });
  }

  res.render('profile', { title: 'Мой профиль', user: req.profile });
}

export async function getUsers(req: CustomRequest, res: Response) {
  if (req.profile.role.id > 2) {
    return res.status(403).redirect('/');
  }

  var usersData = await User.findAll({ attributes: ['id', 'firstName', 'phoneNumber', 'role', 'createdAt'] });
  var users = usersData.map(user => {
    return {
      id: user.id,
      firstName: user.firstName,
      phoneNumber: String(user.phoneNumber).substring(1),
      role: userRole(user.role),
      createdAt: convertTime(user.createdAt),
    }
  });

  res.render('users', { title: 'Все пользователи', user: req.profile, stats: req.stats, users });
}

export async function getUser(req: CustomRequest, res: Response) {
  var userId = req.params.id;
  var userData = await User.findByPk(userId, {
    attributes: ['id', 'firstName', 'phoneNumber', 'role'], include: [{
      model: Srequest,
      as: 'requests',
      include: [{
        model: Service,
        as: 'service',
        attributes: ['name']
      }],
      order: [
        ['id', 'DESC'],
      ]
    }]
  });

  var userProfile = {
    id: userData.id,
    firstName: userData.firstName,
    phoneNumber: String(userData.phoneNumber).substring(1),
    role: userRole(userData.role),
    requests: userData.requests.map(request => {
      return {
        id: request.id,
        createdAt: convertTime(request.createdAt),
        name: request.service.name,
        total: request.total,
        scheduledTime: convertTime(request.scheduledTime),
        status: statusColor(request.status),
      };
    })
  };

  res.render('user', { title: 'Пользователь ' + userProfile.phoneNumber, user: req.profile, stats: req.stats, userProfile });
}

export async function updateUser(req: CustomRequest, res: Response) {
  if (req.profile.id !== Number(req.params.id)) {
    return res.status(403).redirect('/');
  }

  const userData = req.body;
  userData.phoneNumber = userData.phoneNumber.replace(/[\s()\-\+]/g, '');

  if (!userData.firstName) {
    delete userData.firstName;
  }

  if (!userData.password) {
    delete userData.password;
  } else {
    userData.password = await bcrypt.hash(userData.password, 10);
  }

  await User.update(userData, {
    where: {
      id: req.params.id
    }
  });

  res.status(204).redirect('/profile');
}

export async function deleteUser(req: CustomRequest, res: Response) {
  if (req.profile.id !== Number(req.params.id)) {
    return res.status(403).redirect('/');
  }

  // Delete user from DB
  await User.destroy({
    where: {
      id: req.profile.id
    }
  });

  // Delete all user's requests from DB
  await Srequest.destroy({
    where: {
      userId: req.profile.id
    }
  });

  res.status(307).redirect('/');
}
