import { Request, Response } from 'express';
import { CustomRequest } from '../middleware/interface';
import User from '../models/user';
import Srequest from '../models/srequest';
import Service from '../models/service';
import { getStatuses, statusColor } from '../utils/request';
import { convertTime } from '../utils/time';
import * as fs from 'fs'

export async function getRequests(req: CustomRequest, res: Response) {
  if (req.profile.role.id === 1) {
    const requestsData = await Srequest.findAll({
      order: [
        ['status', 'ASC'],
        ['id', 'DESC'],
      ],
      include: [{
        model: Service,
        as: 'service',
        attributes: ['name']
      }, {
        model: User,
        as: 'user',
        attributes: ['firstName', 'phoneNumber']
      }]
    })

    const requests = requestsData.map(request => {
      return {
        id: request.id,
        user: {
          firstName: request.user.firstName,
          phoneNumber: String(request.user.phoneNumber).substring(1),
        },
        service: request.service.name,
        total: request.total,
        status: statusColor(request.status),
        createdAt: convertTime(request.createdAt),
        scheduledTime: convertTime(request.scheduledTime),
      };
    });

    return res.render('requests', { title: 'Все заявки', user: req.profile, stats: req.stats, requests });
  }

  var requestsData = await Srequest.findAll({
    where: { userId: req.profile.id }, include: {
      model: Service,
      as: 'service',
      attributes: ['name']
    }
  })

  var allRequests = requestsData.map(request => {
    return {
      id: request.id,
      createdAt: convertTime(request.createdAt),
      name: request.service.name,
      total: request.total,
      scheduledTime: convertTime(request.scheduledTime),
      status: statusColor(request.status),
    };
  });

  var activeRequests = allRequests.filter(req => req.status.id < 3)

  var completedRequests = {
    items: [...allRequests.filter(req => req.status.id > 2)],
    total: allRequests.filter(req => req.status.id > 2).length
  }

  res.render('requests', { title: 'Заявки', user: req.profile, activeRequests, completedRequests });
}

export async function getRequest(req: CustomRequest, res: Response) {
  var requestId = req.params.id;
  var requestData = await Srequest.findByPk(requestId, {
    include: [{
      model: Service,
      as: 'service',
      attributes: ['name', 'unit']
    }, {
      model: User,
      as: 'specialist',
      attributes: ['id', 'firstName']
    }]
  });
  var request = {
    id: requestData.id,
    createdAt: convertTime(requestData.createdAt),
    name: requestData.service.name,
    unit: requestData.service.unit,
    count: requestData.count,
    cost: requestData.cost,
    total: requestData.total,
    scheduledTime: convertTime(requestData.scheduledTime),
    status: statusColor(requestData.status),
    comment: requestData.comment ?? '-',
    specialist: requestData.specialist,
  };

  if (req.profile.role.id === 1) {
    const statuses = getStatuses();

    return res.render('request', { title: `Заявка № ${request.id}`, user: req.profile, stats: req.stats, request, statuses });
  }

  if (requestData.userId !== req.profile.id) {
    res.status(401).redirect('/requests');
  }

  res.render('request', { title: `Заявка № ${request.id}`, user: req.profile, request });
}

export async function newRequest(req: CustomRequest, res: Response) {
  var services = await Service.findAll();
  var splitServices = [[], [], [], [], []];

  for (const s in services) {
    const catId = services[s].category

    splitServices[catId].push(services[s])
  };

  res.render('new-request', { title: 'Новая заявка', user: req.profile, splitServices });
}

export async function createRequest(req: CustomRequest, res: Response) {
  async function createDBRequest(id: number, req) {
    var serviceData = await Service.findByPk(id);

    Srequest.create({
      userId: req.profile.id,
      serviceId: serviceData.id,
      count: 1,
      cost: serviceData.cost,
      total: serviceData.cost,
      scheduledTime: requestsData.scheduledTime || null,
      comment: requestsData.comment || null,
      status: 1,
      specialistId: null,
    });
  }

  var requestsData = req.body;

  if (typeof requestsData.services === 'string') {
    createDBRequest(Number(requestsData.services), req);
  } else {
    for await (const service of requestsData.services) {
      createDBRequest(Number(service), req);
    }
  }

  res.status(201).redirect('/requests');
}

export async function updateRequest(req: Request, res: Response) {
  var requestData = req.body;

  requestData.total = requestData.cost * requestData.count;

  await Srequest.update(requestData, {
    where: {
      id: req.params.id
    }
  });

  res.redirect('/requests/' + req.params.id);
}
