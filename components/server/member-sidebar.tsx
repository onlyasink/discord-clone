import { ChannelType, MemberRole } from "@prisma/client";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { redirect } from "next/navigation";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import { ServerChannel } from "./server-channel";
import { ServerHeader } from "./server-header";
import { ServerMember } from "./server-member";
import { ServerSearch } from "./server-search";
import { ServerSection } from "./server-section";

type ServerSidebarProps = {
  serverId: string;
};

const iconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
};

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />,
};

export const MemberSidebar = async ({ serverId }: ServerSidebarProps) => {
  const profile = await currentProfile();

  if (!profile) redirect("/");

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  if (!server) redirect("/");

  const textChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT,
  );
  const audioChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO,
  );
  const videoChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO,
  );
  const members = server?.members

  const role = server.members.find(
    (member) => member.profileId === profile.id,
  )?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full bg-transparent border-l border-muted">
      <div className="px-3 mt-2 border-b border-muted pb-2">
        <ServerSection
          sectionType="members"
          server={server}
          role={role}
          label="Members"
        />
      </div>
      <ScrollArea className="flex-1 px-3 shadow-md dark:bg-black bg-white rounded-xl">
        <div className="mt-2">
          {!!members?.length && (
            <div className="mb-2">
              <div className="space-y-[2px]">
                {members.map((member) => (
                  <ServerMember
                    key={member.id}
                    member={member}
                    profile={profile}
                    server={server}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
