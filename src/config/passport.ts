import passport from 'passport';
import passportLocal from 'passport-local';
import User from '../models/user';

const LocalStrategy = passportLocal.Strategy;

passport.use(new LocalStrategy({
  usernameField: 'phoneNumber'
},
  async (login, password, done) => {
    let phoneNumber = login.replace(/[\s()\-\+]/g, '');
    const user = await User.findOne({ where: { phoneNumber: Number(phoneNumber) } });

    if (!user) {
      const error = new Error('Wrong phone number');

      return done(null, false, { message: 'Неверный номер телефона или пароль!'});
    }

    const validate = await user.isValidPassword(password)

    if (!validate) {
      const error = new Error('Wrong password');

      return done(null, false, { message: 'Неверный номер телефона или пароль!' });
    }

    return done(null, user);
  }
));

passport.serializeUser<any, any>((req, user: User, done) => {
  done(null, user);
});

passport.deserializeUser<any, any>((user, done) => {
  User.findByPk(user.id)
    .then(user => done(null, user))
    .catch(err => done(err, false));
});
