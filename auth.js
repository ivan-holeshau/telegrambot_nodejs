// auth.js
var passport = require("passport");
var passportJWT = require("passport-jwt");
var users = require("./users.js");
var cfg = require("./config.js");
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;



var cookieExtractor = function(req) {

    var token = null;
    if (req && req.cookies) token = req.cookies['token'];
    //console.log(req.cookies);
    return token;
};

var params = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: cfg.jwtSecret,
    failureRedirect: '/login'
        //jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};


module.exports = function() {
    var strategy = new JwtStrategy(params, function(payload, done) {
        var user = users[payload.id - 1] || null;
        if (user) {
            //  console.log(user);
            return done(null, user);
        } else {
            // return done(new Error("User not found"), null);
            return done(null, false);
        }
    });
    passport.use(strategy);


    return {
        initialize: function() {
            return passport.initialize();
        },
        authenticate: function() {
            // console.log(passport.authenticate("jwt", cfg.jwtSession));
            return passport.authenticate("jwt", { failureRedirect: '/login', session: false });
        }
    };
};


// function(req, res, next) {
//     passport.authenticate('local',
//       function(err, user, info) {
//         return err 
//           ? next(err)
//           : user
//             ? req.logIn(user, function(err) {
//                 return err
//                   ? next(err)
//                   : res.redirect('/private');
//               })
//             : res.redirect('/');
//       }
//     )(req, res, next);
//   };