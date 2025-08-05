import passport from "passport";
import { Strategy as GithubStrategy } from "passport-github2";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.models.js";
import dotenv from "dotenv";
import { apiError } from "../utils/apiError.js";

dotenv.config({
  path: "./.env",
});

try {
  passport.serializeUser((user, next) => {
    next(null, user._id);
  });

  passport.deserializeUser(async (id, next) => {
    try {
      const user = await User.findById(id);
      if (user) {
        next(null, user);
      } else {
        next(new apiError(404, "User does not exist"), null);
      }
    } catch (error) {
      next(
        new apiError(
          500,
          "Something went wrong when deserialize the user. ERROR: ",
          error
        ),
        null
      );
    }
  });

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (_, __, profile, next) => {
        const user = await User.findOne({ email: profile._json?.email });

        if (user) {
          if (user.authtype !== "google") {
            next(
              new apiError(
                400,
                "You are previously registered using " +
                  user.authtype?.split("_")?.join("&") +
                  ". Please use the " +
                  user.authtype?.split("_")?.join("&") +
                  " login option to access your account."
              ),
              null
            );
          } else {
            next(null, user);
          }
        } else {
          const createdUser = await User.create({
            email: profile._json?.email,
            username: profile._json?.email?.split("@")[0],
            fullname:
              profile._json?.name || profile._json?.email?.split("@")[0],
            password: profile._json?.sub,
            avatar: profile._json?.picture,
            authtype: "google",
          });
          if (createdUser) {
            next(null, createdUser);
          } else {
            next(
              new apiError(500, "Error while registering the user", error),
              null
            );
          }
        }
      }
    )
  );

  passport.use(
    new GithubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
      },
      async (_, __, profile, next) => {
        const user = await User.findOne({ email: profile._json?.email });
        if (user) {
          if (user.authtype !== "github") {
            next(
              new apiError(
                400,
                "You are previously registered using " +
                  user.authtype?.split("_")?.join("&") +
                  ". Please use the " +
                  user.authtype?.split("_")?.join("&") +
                  " login option to access your account."
              ),
              null
            );
          } else {
            next(null, user);
          }
        } else {
          if (!profile._json.email) {
            next(
              new apiError(
                400,
                "It looks like your GitHub email is hidden. Please update your GitHub settings to make your email public, or log in using another available method."
              ),
              null
            );
          } else {
            const existUsername = await User.findOne({
              username: profile?.username,
            });

            const createdUser = await User.create({
              email: profile._json?.email,
              username: existUsername
                ? profile_json.email?.split("@")[0]
                : profile.username,
              fullname: profile._json?.name,
              password: profile._json?.node_id,
              avatar: profile._json?.avatar_url,
              authtype: "github",
            });

            if (createdUser) {
              next(null, createdUser);
            } else {
              next(
                new apiError(500, "Error while registering the user", error),
                null
              );
            }
          }
        }
      }
    )
  );
} catch (error) {
  console.error("PASSPORT ERROR: ", error);
}
