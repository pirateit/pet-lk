import express from 'express';
import { checkAuthenticated } from '../middleware/passport';
import { getRegisterCode, logIn, logOut, register } from '../controllers/auth.controllers';
const router = express.Router();

router.get('/', (req, res) => {
  if (req.isAuthenticated()) return res.redirect('/requests');

  res.render('login', { title: 'Кабинет клиента', error: false });
});
router.get('/register', (req, res) => {
  res.render('register', { title: 'Регистрация', error: false });
});
router.get('/getRegisterCode', getRegisterCode)
router.post('/register', register);
router.get('/login', logIn);
router.get('/logout', logOut);

export default router;
