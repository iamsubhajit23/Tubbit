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
        new apiError(500, `Something went wrong when deserialize the user.`),
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
                `You are previously registered using ${user.authtype?.split("_")?.join("&")}. Please use the ${user.authtype?.split("_")?.join("&")} login option to access your account.`
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
            next(new apiError(500, "Error while registering the user"), null);
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
        scope: ["user:email"],
      },
      async (_, __, profile, next) => {
        try {
          const email =
            profile.emails?.find((e) => e.primary && e.verified)?.value ||
            profile.emails?.[0]?.value ||
            profile._json?.email ||
            null;

          if (!email) {
            return next(
              new apiError(
                400,
                "Unable to retrieve your email from GitHub. Please make sure you have a verified email in your GitHub account."
              ),
              null
            );
          }

          let user = await User.findOne({ email });
          if (user) {
            if (user.authtype !== "github") {
              return next(
                new apiError(
                  400,
                  `You are previously registered using ${user.authtype?.split("_")?.join("&")}. Please use the ${user.authtype?.split("_")?.join("&")} login option to access your account.`
                ),
                null
              );
            }
            return next(null, user);
          }

          let finalUsername = profile.username || email.split("@")[0];
          const usernameExists = await User.findOne({
            username: finalUsername,
          });
          if (usernameExists) {
            finalUsername =
              finalUsername + "_" + Math.floor(Math.random() * 10000);
          }

          const createdUser = await User.create({
            email,
            username: finalUsername,
            fullname: profile._json?.name || finalUsername,
            password: profile._json?.node_id,
            avatar: profile._json?.avatar_url,
            authtype: "github",
          });

          return next(null, createdUser);
        } catch (err) {
          return next(
            new apiError(500, "Error while registering the user"),
            null
          );
        }
      }
    )
  );
} catch (error) {
  console.error("PASSPORT ERROR: ", error);
}
