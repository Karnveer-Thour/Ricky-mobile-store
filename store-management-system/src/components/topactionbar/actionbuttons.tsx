"use client";
import React from "react";
import Iconbadge from "./iconbadge";
import { Bell, MessageCircleIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { storeType } from "@/types/store.index";

interface ActionbuttonsProps {
  unreadMessages: number;
  unreadNotifications: number;
  isDark: boolean;
}

function Actionbuttons({
  unreadMessages,
  unreadNotifications,
  isDark
}: ActionbuttonsProps): React.JSX.Element {


  return (
    <>
      {/* Messages icon */}
      <Iconbadge unreadcount={unreadMessages} isDark={isDark}>
        <MessageCircleIcon
          size={30}
          className={`${
            isDark ? "text-gray-300" : "text-gray-500"
          } hover:text-blue-700`}
        />
      </Iconbadge>
      {/* Notifications icon */}
      <Iconbadge unreadcount={unreadNotifications} isDark={isDark}>
        <Bell
          size={30}
          className={`${
            isDark ? "text-gray-300" : "text-gray-500"
          } hover:text-blue-700`}
        />
      </Iconbadge>
    </>
  );
}

export default Actionbuttons;
