"use client";
import { ChatsContainer } from "@/components/templates/chat-components";
import DefaultButton from "@/components/ui/default/default-button";
import DefaultTitle from "@/components/ui/default/default-title";
import DefaultWrapper from "@/components/ui/default/default-wrapper";
import { useDebounce } from "@/hooks/useDebounce";
import { socket } from "@/lib/socketClient";
import { Icon } from "@iconify/react";
import React, { useEffect, useRef, useState } from "react";

export default function TestPage() {
  const [searchValue, setSearchValue] = useState("");
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "disconnected" | "connecting"
  >("connecting");
  const debouncedSearchValue = useDebounce(searchValue);
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);
  const [username, setUsername] = useState("");
  const [newMessage, setNewMessge] = useState("");
  const [messages, setMessages] = useState<{ sender: string; message: any }[]>(
    []
  );

  useEffect(() => {
    socket.on("message", (data) => {
      console.log(data);
      setMessages((prev) => [...(prev ?? []), data]);
    });

    socket.on("user_joined", (message) => {
      console.log(message);

      setMessages((prev) => [...(prev ?? []), { sender: "system", message }]);
    });

    return () => {
      socket.off("user_joined");
      socket.off("message");
    };
  }, []);

  console.log(messages);

  const handleJoinRoom = () => {
    try {
      if (!room.trim() || !username.trim()) return;

      socket.emit("join-room", { room, username });
      setJoined(true);
    } catch (error) {
      console.error(error);
    }
  };

  const sendMessage = () => {
    const data = { room, message: newMessage, sender: username };
    setMessages((prev) => [...prev, { sender: username, message: newMessage }]);
    setNewMessge("");
    socket.emit("message", data);
  };

  return (
    <div className="p-8">
      {!joined && (
        <div>
          <input
            className="text-white outline-none pr-3 py-1.5"
            placeholder="room..."
            name="room"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <input
            className="text-white outline-none pr-3 py-1.5"
            placeholder="username..."
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button type="submit" onClick={handleJoinRoom}>
            send
          </button>
        </div>
      )}

      {joined && (
        <div className="flex flex-col gap-2.5">
          <DefaultTitle title={room} />
          <DefaultWrapper p={{ p: 2.5 }} col gap={4}>
            {messages.map((m) => (
              <div
                key={`${m.sender}-${m.message}`}
                className={`flex ${
                  m.sender === "system" ? "flex self-center" : "flex-col"
                } gap-1 justify-start text-white ${
                  m.sender === username ? "self-end" : "self-start"
                } p-1 border border-white rounded-lg w-fit`}
              >
                <h1>{m.sender}</h1>
                <p>{m.message}</p>
              </div>
            ))}
          </DefaultWrapper>
          <div className="flex gap-2.5 border border-white p-2 text-white rounded-lg">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessge(e.target.value)}
              placeholder="new message..."
            />
            <button onClick={sendMessage}>send</button>
          </div>
        </div>
      )}
    </div>
  );
}
