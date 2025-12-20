import { SettingsContextOpenType } from "@/app/types/contexts";
import { useChatContext } from "@/context/ChatContext";
import { useSettings } from "@/context/SettingsContext";
import { Children } from "@/types/global";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

export const ChatsContainer = ({ children }: Children) => {
  return (
    <motion.div
      layout
      className="flex flex-col gap-2.5 p-3.5 rounded-3xl w-fit bg-dark-12 max-md:w-full"
    >
      {children}
    </motion.div>
  );
};

export const SettingsWrapper = ({ children }: Children) => {
  const { open, close } = useSettings();

  return (
    <AnimatePresence>
      {open.isOpen && (
        <motion.div
          key="settings"
          initial={{ opacity: 0, filter: "blur(10px)", scale: 0.7, y: 40 }}
          animate={{ opacity: 1, filter: "blur(0px)", scale: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{
            delay: 0.15,
            scale: { type: "spring", stiffness: 200 },
            y: { type: "spring", stiffness: 200, damping: 25 },
            opacity: { type: "tween", duration: 0.25, ease: "easeOut" },
            filter: { type: "tween", duration: 0.25, ease: "easeOut" },
          }}
          className="fixed right-8 top-1/2 -translate-y-1/2 z-9"
        >
          <div className="flex flex-col gap-2.5 p-3.5 min-w-35 min-h-35 overflow-hidden rounded-3xl w-fit bg-dark-12 dark-15-shadow text-white">
            {children}
            <button className="cursor-pointer mt-auto" onClick={close}>
              close
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export function SettingsButton({
  count,
  icon,
  type,
}: {
  count?: number;
  icon: string;
  type: SettingsContextOpenType;
}) {
  const { toggle, changeType, open } = useSettings();

  const handleClick = () => {
    if (!open.isOpen) {
      changeType(type);
      toggle();
      return;
    }

    if (open.type !== type) {
      changeType(type);
      return;
    }

    toggle();
  };

  return (
    <button
      onClick={handleClick}
      className="text-white cursor-pointer relative"
    >
      <Icon icon={icon} />
      {count !== 0 && (
        <div className="absolute text-[10px] -top-1/5 -left-1/3 font-extrabold text-red-600">
          <span>{count}</span>
        </div>
      )}
    </button>
  );
}

export function FriendRequestsWrapper({
  username,
  image,
  handleResponse,
  joined,
}: {
  username: string;
  image: string | undefined;
  joined: string;
  handleResponse: (status: "accept" | "reject") => void;
}) {
  return (
    <div className="flex justify-between border w-full p-2.5 gap-5 border-dark-15 rounded-xl">
      <div className="flex gap-2.5 items-center">
        {image && (
          <Image
            src={image}
            alt={`${username}-profile`}
            width={48}
            height={48}
            className="rounded-xl"
          />
        )}
        <div className="flex flex-col justify-between">
          <h1 className="text-lg font-medium">{username}</h1>
          <p className="text-sm text-grey-70">Sent {joined}</p>
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => handleResponse("accept")}
          className="w-8 h-8 cursor-pointer rounded-full bg-green-600 flex justify-center items-center"
        >
          <Icon icon={"mingcute:check-fill"} />
        </button>
        <button
          onClick={() => handleResponse("reject")}
          className="w-8 h-8 cursor-pointer rounded-full bg-red-600 flex justify-center items-center"
        >
          <Icon icon={"mingcute:close-fill"} />
        </button>
      </div>
    </div>
  );
}

export const FriendWrapper = ({
  image,
  name,
  handleStartNewConversation,
  handleDeleteFriend,
  redirectProfile
}: {
  image: string | null;
  name: string;
  handleStartNewConversation: () => void;
  handleDeleteFriend: () => void;
  redirectProfile: () => void
}) => {
  const [sure, setSure] = useState(false);
  return (
    <div className="flex border items-center p-2 gap-5 border-dark-15 rounded-xl select-none relative">
      <div className="flex gap-2">
        {image && (
          <Image
            src={image}
            alt={`${name}-friend-wrapper-profile`}
            width={42}
            height={42}
            className="rounded-xl cursor-pointer"
            onClick={redirectProfile}
          />
        )}
        <div className="flex flex-col justify-between h-full">
          <h1 className="text-base font-medium text-white">{name}</h1>
          <button
            onClick={handleStartNewConversation}
            className="text-grey-70 hover:underline cursor-pointer text-nowrap text-sm"
          >
            start new conversation
          </button>
        </div>
      </div>
      <button
        className="w-8 h-8 cursor-pointer rounded-full bg-red-600 flex justify-center items-center"
        onClick={() => setSure(true)}
      >
        <Icon icon={"mingcute:close-fill"} />
      </button>
      <AnimatePresence>
        {sure && (
          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)", scale: 0.7, y: 40 }}
            animate={{ opacity: 1, filter: "blur(0px)", scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{
              delay: 0.15,
              scale: { type: "spring", stiffness: 200 },
              y: { type: "spring", stiffness: 200, damping: 25 },
              opacity: { type: "tween", duration: 0.25, ease: "easeOut" },
              filter: { type: "tween", duration: 0.25, ease: "easeOut" },
            }}
            className="flex flex-col absolute bg-dark-10 p-2 rounded-xl items-center z-10 gap-1"
          >
            <p className="text-white text-center">
              Are you sure you want to unfriend this user?
            </p>
            <div className="flex gap-3.5">
              <button
                onClick={() => handleDeleteFriend()}
                className="w-8 h-8 cursor-pointer rounded-full bg-green-600 flex justify-center items-center"
              >
                <Icon icon={"mingcute:check-fill"} />
              </button>
              <button
                onClick={() => setSure(false)}
                className="w-8 h-8 cursor-pointer rounded-full bg-red-600 flex justify-center items-center"
              >
                <Icon icon={"mingcute:close-fill"} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const ConversationParticipants = ({
  name,
  image,
  lastMessage,
  onClick,
  selected,
}: {
  name: string;
  image: string | null;
  lastMessage: string | undefined;
  onClick: () => void;
  selected: boolean;
}) => {
  return (
    <div
      className={
        `flex border items-center p-2 gap-5 
        border-dark-15 rounded-xl select-none 
        relative cursor-pointer ${selected && "bg-dark-25/80"}`
      }
      onClick={onClick}
    >
      <div className="flex gap-2 items-center">
        {image && (
          <Image
            src={image}
            alt={`${name}-friend-wrapper-profile`}
            width={44}
            height={44}
            className="rounded-xl"
          />
        )}
        <div className="flex flex-col justify-between h-full">
          <h1 className="text-base font-medium text-white">{name}</h1>
          <p className="text-grey-70 text-nowrap truncate max-w-20">
            {lastMessage ?? "Say hi 👋"}
          </p>
        </div>
      </div>
    </div>
  );
};

export const ConversationContainer = ({ children }: Children) => {
  const { conversationId, close } = useChatContext();

  return (
    <AnimatePresence>
      {conversationId.trim() && (
        <motion.div
          key="conversation"
          style={{ originX: 0, originY: 0 }}
          initial={{ opacity: 0, scale: 0.7, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0 }}
          transition={{
            delay: 0.15,
            scale: { type: "spring", stiffness: 100 },
            opacity: { type: "tween", duration: 0.25, ease: "easeOut" },
            filter: { type: "tween", duration: 0.25, ease: "easeOut" },
          }}
          className="w-3/5 h-full relative max-md:w-full"
        >
          <button
            onClick={close}
            className={`w-6 h-6 cursor-pointer text-xs rounded-full bg-red-600 
              flex justify-center items-center text-white mx-auto mb-2.5`}
          >
            <Icon icon={"mingcute:close-fill"} />
          </button>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
