import { Request, Response } from 'express';
import User from '../models/user';
import Srequest from '../models/srequest';
import Service from '../models/service';
import { statusColor } from '../middleware/request';

export const getAdminPage = (req: Request, res: Response) => {
  const user = req.user as User;

  res.render('admin/index', { title: 'Панель администратора', reducedName: user.firstName ?? 'Клиент' });
};

export const getRequest = async (req: Request, res: Response) => {
  const user = req.user as User;
  const srequestId = req.params.id;
  const srequestData = await Srequest.findByPk(srequestId, { include: [{
    model: Service,
    as: 'service',
    attributes: ['name', 'unit']
  }, {
    model: User,
    as:'specialist',
    attributes: ['firstName']
  }] });

  if (srequestData.userId !== user.id) {
    res.status(401).redirect('/requests');
  }

  const formattedDate = `${srequestData.createdAt.toLocaleDateString()}  ${srequestData.createdAt.toTimeString().slice(0, 5)}`;
  const request = {
    id: srequestData.id,
    createdAt: formattedDate,
    name: srequestData.service.name,
    unit: srequestData.service.unit,
    count: srequestData.count,
    cost: srequestData.cost,
    total: srequestData.total,
    status: statusColor(srequestData.status),
    comment: srequestData.comment ?? '-',
    specialist: srequestData.specialist?.firstName ?? '-',
  };

  res.render('srequest', { title: `Заявка № ${request.id}`, reducedName: user.firstName ?? 'Клиент', request });
};

export const registerRequest = async (req: Request, res: Response) => {
  const requestData = req.body;
  const user = req.user as User;

  for (const service in requestData.service) {
    const serviceData = await Service.findByPk(requestData.service[service]);

    if (!requestData.comment.length) {
      requestData.comment = null;
    }

    Srequest.create({
      userId: user.id,
      serviceId: serviceData.id,
      count: 1,
      cost: serviceData.cost,
      total: serviceData.cost,
      comment: requestData.comment,
      status: 1,
      specialistId: null,
    });
  }

  res.status(201).redirect('/requests');
};

export const getAllUserRequests = async (req: Request, res: Response) => {
  const user = req.user as User;

  let requests = await Srequest.findAll({where: { userId: user.id }, include: {
    model: Service,
    as: 'service',
    attributes: ['name', 'unit']
  }})
  const services = await Service.findAll();

  let fullRequests = requests.map(request => {
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

  const splitServices = [[], [], [], []];

  for (const s in services) {
    const catId = services[s].category

    splitServices[catId].push(services[s])
  };

  res.render('requests', { title: 'Заявки', reducedName: user.firstName ?? 'Клиент', splitServices, fullRequests });
};

export const getAllRequests = async (req: Request, res: Response) => {
  const user = req.user as User;

  let requests = await Srequest.findAll({ include: [{
    model: Service,
    as: 'service',
    attributes: ['name', 'unit']
  }, {
    model: User,
    as:'specialist',
    attributes: ['firstName']
  }, {
    model: User,
    as:'user',
    attributes: ['firstName', 'phoneNumber']
  }]})
  const services = await Service.findAll();

  const fullRequests = requests.map(request => {
    const formattedDate = `${request.createdAt.toLocaleDateString()} ${request.createdAt.toTimeString().slice(0, 5)}`;

    return {
      id: request.id,
      createdAt: formattedDate,
      user: {
        firstName: request.user.firstName,
        phoneNumber: request.user.phoneNumber
      },
      name: request.service.name,
      status: statusColor(request.status)
    };
  });

  const splitServices = [[], [], [], []];

  for (const s in services) {
    const catId = services[s].category

    splitServices[catId].push(services[s])
  };

  res.render('admin/requests', { title: 'Заявки', reducedName: user.firstName ?? 'Клиент', splitServices, fullRequests });
};

export const getAdminRequest = async (req: Request, res: Response) => {
  const user = req.user as User;
  const srequestId = req.params.id;
  const srequestData = await Srequest.findByPk(srequestId, { include: [{
    model: Service,
    as: 'service',
    attributes: ['name', 'unit']
  }, {
    model: User,
    as:'specialist',
    attributes: ['firstName']
  }, {
    model: User,
    as:'user',
    attributes: ['firstName', 'phoneNumber']
  }] });

  const formattedDate = `${srequestData.createdAt.toLocaleDateString()}  ${srequestData.createdAt.toTimeString().slice(0, 5)}`;
  const request = {
    id: srequestData.id,
    createdAt: formattedDate,
    name: srequestData.service.name,
    unit: srequestData.service.unit,
    count: srequestData.count,
    cost: srequestData.cost,
    total: srequestData.total,
    status: {id: srequestData.status, ...statusColor(srequestData.status)},
    comment: srequestData.comment ?? '-',
    specialist: srequestData.specialist?.firstName ?? '-',
  };

  res.render('admin/request', { title: `Заявка № ${request.id}`, reducedName: user.firstName ?? 'Клиент', request });
};

export const updateAdminRequest = async (req: Request, res: Response) => {
  const requestData = req.body;

  if (!requestData.count || !requestData.cost) {
    return res.redirect('/admin/requests/' + req.params.id);
  }

  await Srequest.update(requestData, {
    where: {
      id: req.params.id
    }
  });

  res.redirect('/admin/requests/' + req.params.id)
};
