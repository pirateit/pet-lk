import https from 'https';
import { Request, Response, NextFunction } from "express";
import passport from 'passport';
import { getAsync, setAsync } from '../config/redis';
import User from '../models/user';

export const getRegisterCode = async (req: Request, res: Response) => {
  let phoneNumber = '';

  if (typeof req.query.phone === "string") {
    phoneNumber = req.query.phone.replace(/[\s()\-\+]/g, '');
  }

  const user = await User.findOne({ where: { phoneNumber: Number(phoneNumber) } });

  if (user) {
    return res.sendStatus(204);
  }

  // Generate 4-digits code
  const confirmCode = ((min = 1000, max = 9999): String => {
    min = Math.ceil(min);
    max = Math.floor(max);

    return String(Math.floor(Math.random() * (max - min) + min));
  })();
  console.log(confirmCode);
  const message = `Код подтверждения: ${confirmCode}.`;

  function makeRequest(): Promise<any> {
    return new Promise((resolve, reject) => {
      const request = https.request(`https://sms.ru/sms/send?api_id=${process.env.SMS_API}&to=${phoneNumber}&msg=${message}&json=1`, (response) => {
        if (response.statusCode !== 100) {
          return res.status(503).send({ error: 'error', message: 'Произошла внутренняя ошибка. Пожалуйста, попробуйте позже.' });
        }

        response.on('data', (data) => {
          resolve(JSON.parse(data));
        });
      });

      request.on('error', (err) => {
        reject(err);
      });

      request.end();
    });
  }

  makeRequest()
    .then(async (res) => {
      if (res.status_code === 100) {
        await setAsync(phoneNumber, confirmCode, 'EX', 60 * 15); // Save SMS code in Redis for 15 minutes
      }
    })
    .catch(err => console.log(err));

  res.sendStatus(200);
};

export const register = async (req: Request, res: Response) => {
  let phoneNumber = '';

  if (typeof req.body.phoneNumber === "string") {
    phoneNumber = req.body.phoneNumber.replace(/[\s()\-\+]/g, '');
  }

  const confirmCode = req.body.confirmCode;
  const password = req.body.password;
  const user = await User.findOne({ where: { phoneNumber: Number(phoneNumber) } });

  if (user) {
    return res.render('register', { error: 'existsError', message: 'Данный номер уже зарегистрирован.' });
  }

  const value = await getAsync(phoneNumber);

  if (value !== confirmCode) {
    return res.status(406).render('register', { error: 'codeError', message: 'Неверно указан код подтверждения' });
  }

  await User.create({ phoneNumber: Number(phoneNumber), password })

  res.status(201).render('login', { message: 'Учётная запись успешно создана' });
};

export const logIn = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.render('login', { error: info.message, phoneNumber: req.body.phoneNumber });
    }
    req.login(user, function (err) {
      if (err) { return next(err); }

      return res.redirect('/requests');
    });
  })(req, res, next);
};

export const logOut = (req: Request, res: Response) => {
  req.logout();
  req.session.destroy(function () {
    res.redirect('/');
  });
};
