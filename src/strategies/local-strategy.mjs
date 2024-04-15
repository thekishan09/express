import passport from "passport";
import { Strategy } from "passport-local";
import USERS_LIST from "../mock-data/users.mjs";
import { User } from "../mongoose/schemas/user.schema.mjs";
import { comparePassword } from "../utils/helpers.mjs";

passport.serializeUser((user, done) => {
  done(null, user._id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = User.findById(id);
    if (!user) throw new Error("User not found");
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
export default passport.use(
  new Strategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });

      if (!user) throw new Error("User not found");
      else if (!comparePassword("" + password, user.password))
        throw new Error("Bad Credential for the user " + username);
      else done(null, user);
    } catch (err) {
      done(err, null);
    }
  })
);
