import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../axios/axios";
import { IChatRoom } from "../types/chatRoom";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { BASE_URL } from "../consts/consts";

export function ChatRoom() {
  const { id } = useParams<{ id: string }>();
  const [chatRoom, setChatRoom] = useState<IChatRoom | null>(null);

  useEffect(() => {
    const fetchChatRoom = async () => {
      try {
        const response = await axiosInstance.get(`/api/chat/${id}`);
        if (response.status !== 200) {
          throw new Error(`Unexpected response status: ${response.status}\n. Error message: ${response.statusText} `);
        }
        const data: IChatRoom = response.data;
        setChatRoom(data);
      }
      catch (err: unknown) {
        console.log(err);
      }
    }
    if (id) {
      fetchChatRoom();
    }
  }, [id]);


  useEffect(() => {
    const startConnection = async () => {
      if (!chatRoom) {
        return;
      }
      if (!id) {
        return;
      }

      const newConnection = new HubConnectionBuilder()
        .withUrl(`${BASE_URL}/Chat`, {
          accessTokenFactory: () => localStorage.getItem("token") || ""
        })
        .withAutomaticReconnect()
        .build()

      try {
        await newConnection.start();
        console.log("connection started");
        await newConnection.invoke("JoinChat", parseInt(id));
        console.log(`joined chat`);

        newConnection.on("UserJoined", (username: string) => {
          console.log(`${username} has joined the chat`);
        })
      } catch (err: unknown) {
        console.log(err);
      }
    }
    startConnection();
  }, [chatRoom]);

  return (
    <>
      <div>Chat Room: {chatRoom?.name}</div>
      <div>Messages: </div>
      <div>{}</div>
      <textarea></textarea>
      <button>send message</button>
    </>
  )
}
