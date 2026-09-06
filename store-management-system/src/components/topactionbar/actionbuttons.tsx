"use client";
import React, { useState } from "react";
import Iconbadge from "./iconbadge";
import { Bell, MessageCircleIcon } from "lucide-react";
import NotificationCenter from "./notificationCenter";
import MessagesPopover from "./messagesPopover";

interface ActionbuttonsProps {
  unreadMessages: number;
  unreadNotifications: number;
  isDark: boolean;
}

function Actionbuttons({
  unreadMessages: initialMessages,
  unreadNotifications: initialNotifications,
  isDark,
}: ActionbuttonsProps): React.JSX.Element {
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(initialMessages);
  const [unreadNotifications, setUnreadNotifications] =
    useState(initialNotifications);

  return (
    <>
      {/* Messages button */}
      <div className="relative">
        <button
          onClick={() => {
            setMessagesOpen(!messagesOpen);
            setNotificationsOpen(false);
          }}
          className="focus:outline-none transition-transform hover:scale-105 active:scale-95"
          aria-label="Open messages"
        >
          <Iconbadge unreadcount={unreadMessages} isDark={isDark}>
            <MessageCircleIcon
              size={26}
              className={`${
                isDark ? "text-gray-300" : "text-gray-600"
              } hover:text-cyan-400 transition-colors`}
            />
          </Iconbadge>
        </button>

        <MessagesPopover
          isOpen={messagesOpen}
          onClose={() => setMessagesOpen(false)}
          isDark={isDark}
          unreadCount={unreadMessages}
          setUnreadCount={setUnreadMessages}
        />
      </div>

      {/* Notifications button */}
      <div className="relative">
        <button
          onClick={() => {
            setNotificationsOpen(!notificationsOpen);
            setMessagesOpen(false);
          }}
          className="focus:outline-none transition-transform hover:scale-105 active:scale-95"
          aria-label="Open notifications"
        >
          <Iconbadge unreadcount={unreadNotifications} isDark={isDark}>
            <Bell
              size={26}
              className={`${
                isDark ? "text-gray-300" : "text-gray-600"
              } hover:text-cyan-400 transition-colors`}
            />
          </Iconbadge>
        </button>

        <NotificationCenter
          isOpen={notificationsOpen}
          onClose={() => setNotificationsOpen(false)}
          isDark={isDark}
          unreadCount={unreadNotifications}
          setUnreadCount={setUnreadNotifications}
        />
      </div>
    </>
  );
}

export default Actionbuttons;
