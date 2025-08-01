import { MemberRole } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const profile = await currentProfile();
    const { name, type } = await req.json();
    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get("serverId");

    if (!profile) return new NextResponse("Unauthorized.", { status: 401 });
    if (!serverId)
      return new NextResponse("Server ID is missing.", { status: 400 });
    if (name === "general")
      return new NextResponse('Name cannot be "general".', { status: 400 });

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          create: {
            profileId: profile.id,
            position: 1,
            categoryId: searchParams.get("categoryId") || undefined,
            name,
            type,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error: unknown) {
    console.error("[CHANNELS_POST]: ", error);
    return new NextResponse("Internal Server Error.", { status: 500 });
  }
}
