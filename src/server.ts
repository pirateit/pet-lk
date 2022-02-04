require('dotenv').config();
import express from "express";
import session from 'express-session';
var RedisStore = require('connect-redis')(session);
import { redisClient } from './config/redis';
import passport from 'passport';
import path from 'path';
import './config/passport';
import './models/index';
import authRouter from './routes/auth.routes';
import usersRouter from './routes/users.routes';
import servicesRouter from './routes/services.routes';
import srequestsRouter from './routes/srequests.routes';
var app = express();

app.set('view engine', 'pug');

// app.use(favicon()) // npm serve-favicon
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  rolling: true,
  saveUninitialized: false,
  cookie: {
      secure: false,
      httpOnly: false,
      maxAge: 1000 * 60 * 60 * 24
  }
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(authRouter);
app.use(usersRouter);
app.use(servicesRouter);
app.use(srequestsRouter);

app.listen(process.env.APP_PORT || 3000, () => {
  console.log(`Server started successfully.`);
});
