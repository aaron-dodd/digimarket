const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const UserModel = require('../../model/user');

passport.use(
    'signupStrategy',
    new localStrategy(
        {
            usernameField: 'username',
            passwordField: 'password',
        },
        async (username, password, done) => {
            try {
                const existing = await UserModel.findOne({ username });
                if (existing) {
                    await UserModel.findOneAndRemove({ username });
                }

                const user = await UserModel.create({ username, password });
                return done(null, user);
            } catch (signupError) {
                done(signupError);
            }
        }
    )
);

passport.use(
    'loginStrategy',
    new localStrategy(
        {
            usernameField: 'username',
            passwordField: 'password'
        },
        async (username, password, done) => {
            try {
                const user = await UserModel.findOne({ username });

                if (!user) {
                    return done(null, false, { message: 'User not found' });
                }

                const validate = await user.isValidPassword(password);

                if (!validate) {
                    return done(null, false, { message: 'Wrong Password' });
                }

                return done(null, user, { message: 'Logged in Successfully' });
            } catch (loginError) {
                return done(loginError);
            }
        }
    )
);