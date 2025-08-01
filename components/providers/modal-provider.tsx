"use client";

import { useEffect, useState } from "react";

import { CreateChannelModal } from "@/components/modals/create-channel-modal";
import { CreateServerModal } from "@/components/modals/create-server-modal";
import { DeleteChannelModal } from "@/components/modals/delete-channel-modal";
import { DeleteMessageModal } from "@/components/modals/delete-message-modal";
import { DeleteServerModal } from "@/components/modals/delete-server-modal";
import { EditChannelModal } from "@/components/modals/edit-channel-modal";
import { EditServerModal } from "@/components/modals/edit-server-modal";
import { InviteModal } from "@/components/modals/invite-modal";
import { LeaveServerModal } from "@/components/modals/leave-server-modal";
import { MembersModal } from "@/components/modals/members-modal";
import { MessageFileModal } from "@/components/modals/message-file-modal";
import { CreateCategoryModal } from "../modals/create-category-modal";
import { CssEditorModal } from "../modals/css-editor-modal";
import { SwitchVoiceChannelModal } from "../modals/switch-voice-channel-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return null;

  return (
    <>
      <CreateChannelModal />
      <CreateServerModal />
      <DeleteChannelModal />
      <DeleteMessageModal />
      <DeleteServerModal />
      <EditChannelModal />
      <EditServerModal />
      <InviteModal />
      <LeaveServerModal />
      <MembersModal />
      <MessageFileModal />
      <CreateCategoryModal />
      <CssEditorModal initialCss="" />
      <SwitchVoiceChannelModal />
    </>
  );
};
