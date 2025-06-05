"use client";
import React from "react";
import Iconbadge from "./iconbadge";
import { Bell, MessageCircleIcon } from "lucide-react";

interface ActionbuttonsProps {
  unreadMessages: number;
  unreadNotifications: number;
}

function Actionbuttons({
  unreadMessages,
  unreadNotifications,
}: ActionbuttonsProps) {
  return (
    <>
      {/* Messages icon */}
      <Iconbadge unreadcount={unreadMessages}>
        <MessageCircleIcon
          size={30}
          className="text-gray-500 hover:text-blue-700"
        />
      </Iconbadge>
      {/* Notifications icon */}
      <Iconbadge unreadcount={unreadNotifications}>
        <Bell size={30} className="text-gray-500 hover:text-blue-700" />
      </Iconbadge>
    </>
  );
}

export default Actionbuttons;
