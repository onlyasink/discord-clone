import { createRouteHandler } from "uploadthing/next";

import { appFileRouter } from "./core";
import { UTApi } from "uploadthing/server";

export const { GET, POST } = createRouteHandler({
  router: appFileRouter,
  config: {
    uploadthingId: process.env.UPLOADTHING_APP_ID!,
    uploadthingSecret: process.env.UPLOADTHING_SECRET!,
    callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/uploadthing`,
  },
});

export const utapi = new UTApi();