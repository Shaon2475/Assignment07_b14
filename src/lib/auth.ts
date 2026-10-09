import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI as string);

export const auth = betterAuth({
  database: mongodbAdapter(client.db()),
  emailAndPassword: { enabled: true, autoSignIn: false }, // after sign up -> go to sign in page
  account: {
    accountLinking: { enabled: true, trustedProviders: ["github", "google"] },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => ({ data: { ...user, emailVerified: true } }),
      },
    },
  },
  socialProviders: {
    google: { clientId: process.env.GOOGLE_CLIENT_ID as string, clientSecret: process.env.GOOGLE_CLIENT_SECRET as string },
    github: { clientId: process.env.GITHUB_CLIENT_ID as string, clientSecret: process.env.GITHUB_CLIENT_SECRET as string },
  },
});
