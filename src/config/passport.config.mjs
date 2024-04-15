import passport from "passport";

export default function passportConfiguration(app){
    app.use(passport.initialize())
    app.use(passport.session())
}