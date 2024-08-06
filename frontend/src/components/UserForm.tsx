import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { useState } from "react"
import { BASE_URL } from "../consts/consts";

export function UserForm() {
  const [username, setUsername] = useState("");
  const [chatroom, setChatRoom] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    joinChatRoom(username, chatroom);
  }

  const joinChatRoom = async (username: string, chatroom: string) => {
    const conn = new HubConnectionBuilder()
      .withUrl(`${BASE_URL}/Chat`)
      .configureLogging(LogLevel.Information)
      .build();
    conn.on("ReceivedMessage", (username: string, chatroom: string) => {
      console.log(`user ${username} joined chat ${chatroom}`);
    })
    await conn.start();
    await conn.invoke("JoinChat", { username: username, chatroom: chatroom });
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>username</label>
        <input
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />

        <label>groupchat</label>
        <input
          type="text"
          value={chatroom}
          onChange={(event) => setChatRoom(event.target.value)}
        />
        <input type="submit" />
      </form>
    </div>
  )
}
