"use client"

import {
  MemberRole,
  type Member,
  type Profile,
  type Server,
} from "@prisma/client";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

import { UserAvatar } from "../user-avatar";
import { useEffect, useState } from "react";
import { useSocket } from "../providers/socket-provider";

type ServerMemberProps = {
  member: Member & { profile: Profile };
  server: Server;
  profile: Profile | null;
};

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
};

export const ServerMember = ({ member, profile, server }: ServerMemberProps) => {
  const { socket } = useSocket();
  const onClick = () => {
    if (member.profile.name === profile?.name) {
      router.push(`/conversations/me`);
      return;
    } else {
      router.push(`/conversations/${member.id}`);
    }
  };
  const params = useParams();
  const router = useRouter();
  const [status, setStatus] = useState<"ONLINE" | "IDLE" | "DND" | "INVISIBLE" | "OFFLINE">(member.profile.status as "ONLINE" | "IDLE" | "DND" | "INVISIBLE" | "OFFLINE");
  const icon = roleIconMap[member.role];

  // Listen for socket status updates
  useEffect(() => {
    const handler = (payload: { userId: string; status: string }) => {
      if (payload.userId === member.profile.userId) {
        const allowedStatuses = ["ONLINE", "IDLE", "DND", "INVISIBLE", "OFFLINE"];
        if (allowedStatuses.includes(payload.status)) {
          setStatus(payload.status as "ONLINE" | "IDLE" | "DND" | "INVISIBLE" | "OFFLINE");
        }
      }
    };
    // @ts-ignore
    socket.on("user:status:update", handler);
    return () => {
      // @ts-ignore
      socket.off("user:status:update", handler);
    };
  }, [member.profile.userId]);

  // Status indicator mapping
  const statusMap: Record<string, { color: string; text: string }> = {
    ONLINE: { color: "bg-green-500", text: "Online" },
    IDLE: { color: "bg-yellow-500", text: "Idle" },
    DND: { color: "bg-red-500", text: "Do Not Disturb" },
    INVISIBLE: { color: "bg-gray-400", text: "Invisible" },
  };

  const isOffline = status === "OFFLINE" || !status;

  return (
    <button
      onClick={onClick}
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700",
      )}
    >
      <div className="relative">
        <UserAvatar
          src={member.profile.imageUrl}
          alt={member.profile.name}
          className={cn(
            "h-8 w-8 md:h-8 md:w-8 transition",
            isOffline && "opacity-40"
          )}
        />
        {!isOffline && statusMap[status] && (
          <span
            className={cn(
              "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white",
              statusMap[status].color
            )}
            title={statusMap[status].text}
          />
        )}
      </div>
      <p
        className={cn(
          "font-semibold text-sm group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition",
          isOffline
            ? "text-zinc-400 opacity-70"
            : "text-zinc-500 dark:text-zinc-400",
          params?.memberId === member.id &&
            (isOffline
              ? ""
              : "text-primary dark:text-zinc-200 dark:group-hover:text-white")
        )}
      >
        {member.profile.name}
      </p>
      {icon}
    </button>
  );
};
