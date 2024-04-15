import express from "express";

import expressConfiguration from "./config/environment.config.mjs";
import routerConfiguration from "./config/router.config.mjs";
import userRouter from "./routes/users.route.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import USERS_LIST from "./mock-data/users.mjs";
import responseJSON from "./models/user.response.mjs";
import "./strategies/local-strategy.mjs";
import passport from "passport";
import passportConfiguration from "./config/passport.config.mjs";
import databaseConfig from "./config/database.config.mjs";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";

const app = express();
app.use(cookieParser("secret"));
databaseConfig();
app.use(
  session({
    secret: "session for kishan",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60,
    },
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
    }),
  })
);
expressConfiguration(app, express);
routerConfiguration(app, userRouter);
passportConfiguration(app);

app.post("/api/auth", passport.authenticate("local"), (req, res) => {
  res.send(
    responseJSON(true, "Successfully authenticated", req.session.passport)
  );
});

// app.post("/api/auth",passport.authenticate("local"), (req, res) => {
//   const {
//     body: { first_name, id },
//   } = req;

//   const user = USERS_LIST.find(
//     (item) => item.first_name === first_name && item.id === id
//   );
//   if (!user) {
//     res.status(401).send(responseJSON(false, "Not a valid user", null));
//     res.end();
//   } else {
//     req.session.user = user;
//     res.send(responseJSON(true, "User Fetched", user));
//   }
// });
app.get("/api/auth/status", (req, res) => {
  return req.user
    ? res.status(200).send(req.session)
    : res
        .status(401)
        .send(responseJSON(false, "User is not authenticated", null));
});
app.get("/api/auth/logout", (req, res) => {
  if (!req.user) res.status(401).send();

  req.logout((err) => {
    if (err) res.status(400).send();
    res.status(200).send();
  });
});
