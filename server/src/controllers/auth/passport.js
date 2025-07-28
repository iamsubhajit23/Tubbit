import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2"
import dotenv from "dotenv"
import { User } from "../../models/user.models.js"

dotenv.config({
    path: "./.env"
})

passport.use(new GitHubStrategy(
    {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
        scope: ["user:email", "read:user"],
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails?.[0]?.value;
            if (!email) {
                return done(new Error("Email not available"), false);
            }

            const existingUser = await User.findOne({ email });
            if (!existingUser) {
                const createdUser = await User.create(
                    {
                        username: profile.username?.toLowerCase(),
                        fullname: profile.displayName || profile.username,
                        email,
                        avatar: profile.photos?.[0]?.value,
                        refreshtoken: refreshToken,
                        authtype: "github",
                    }
                )
                return done(null, createdUser)
            }

            return done(null, existingUser);
        } catch (error) {
            return done(error, false);
        }
    }
));

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (_id, done) => {
    try {
        const user = await User.findById(_id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});