import { Request, Response } from 'express';
import User from '../models/user';
import Service from '../models/service';
import { CustomRequest } from '../middleware/interface';
import { getCategories, getUnits, serviceCategory } from '../utils/service';

export async function getServices(req: CustomRequest, res: Response) {
  var servicesData = await Service.findAll({
    order: [
      ['id', 'DESC'],
    ]
  });

  var services = servicesData.map(service => {
    return {
      id: service.id,
      category: serviceCategory(service.category),
      name: service.name,
      unit: service.unit,
      cost: service.cost
    }
  });

  res.render('services', { title: 'Услуги', user: req.profile, stats: req.stats, services });
}

export async function updateService(req: Request, res: Response) {
  var serviceData = req.body;

  await Service.update(serviceData, {
    where: {
      id: req.params.id
    }
  });

  res.redirect('/services/' + req.params.id);
}

export async function addService(req: CustomRequest, res: Response) {
  var categories = getCategories();
  var units = getUnits();

  res.render('add-service', { title: 'Добавление услуги', user: req.profile, stats: req.stats, categories, units });
}

export async function registerService(req: Request, res: Response) {
  var requestsData = req.body;

  await Service.create(requestsData);

  res.status(201).redirect('/services');
}

export async function getService(req: CustomRequest, res: Response) {
  var serviceId = req.params.id;
  var categories = getCategories();
  var units = getUnits();
  var serviceData = await Service.findByPk(serviceId);
  var service = {
    id: serviceData.id,
    category: serviceCategory(serviceData.category),
    name: serviceData.name,
    unit: serviceData.unit,
    cost: serviceData.cost
  };

  res.render('service', { title: service.name, user: req.profile, stats: req.stats, categories, units, service });
}
