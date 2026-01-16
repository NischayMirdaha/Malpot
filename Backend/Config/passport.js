import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import prisma from "../prisma/prismaClient.js"; // adjust path if needed

// Local Strategy (Email + Password)
passport.use(
  new LocalStrategy(
    {
      usernameField: "email", // login using email
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const guest = await prisma.guest.findUnique({
          where: { email },
        });

        if (!guest) {
          return done(null, false, { message: "User not found" });
        }

        if (!guest.isVerified) {
          return done(null, false, { message: "Email not verified" });
        }

        const isMatch = await bcrypt.compare(password, guest.password);
        if (!isMatch) {
          return done(null, false, { message: "Invalid password" });
        }

        return done(null, guest);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const guest = await prisma.guest.findUnique({
      where: { id },
    });
    done(null, guest);
  } catch (error) {
    done(error);
  }
});

export default passport;
