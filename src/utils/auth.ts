import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/utils/database";
import { genericOAuth } from "better-auth/plugins";
import { reactStartCookies } from "better-auth/react-start";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "sqlite"
  }),
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "authentik",
          clientId: process.env.AUTH_AUTHENTIK_ID || "",
          clientSecret: process.env.AUTH_AUTHENTIK_SECRET || "",
          discoveryUrl: process.env.AUTH_AUTHENTIK_ISSUER || "",
        },
      ],
    }),
    reactStartCookies(),
  ],
});
