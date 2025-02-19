"use client";

import { ChatMessages } from "@/app/(tab)/(custom)/chat/[id]/page";
import { useState } from "react";
import ChatInput from "./chatInput";

interface ChatListProps {
  initialMessageList: ChatMessages;
  currentUserId: number;
}

export default function ChatList({ initialMessageList, currentUserId }: ChatListProps) {
  const [messages, setMessages] = useState(initialMessageList);

  const handleMessageSubmit = (e) => {
    // setMessages(prev => [...prev, {
    //   id: new Date(),
      
      
    // }])
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex grow flex-col">
        {messages.map((message, index) => (
          <div key={message.id} className={`${currentUserId === message.id ? "self-end" : "self-start"}`}>
            {messages[index - 1]?.id !== message.id && currentUserId !== message.id && (
              <span className="mb-1 ml-1 block">{message.username}</span>
            )}
            <p className={`rounded-lg ${currentUserId === message.id ? "bg-yellow-400" : "bg-stone-300"} px-3 py-2`}>
              {message.payload}
            </p>
          </div>
        ))}
      </div>
      <div className="mb-1">
        <form onSubmit={handleMessageSubmit}>
          <ChatInput />
        </form>
      </div>
    </div>
  );
}
