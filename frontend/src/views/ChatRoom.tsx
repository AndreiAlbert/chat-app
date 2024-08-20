import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr"
import { ChangeEvent, useEffect, useState } from "react"
import { BASE_URL } from "../consts/consts";
import { useParams } from "react-router-dom";
import { IChatRoom, IMessage } from "../types/chatRoom";
import axiosInstance from "../axios/axios";
import { Box, Button, Card, CardContent, TextareaAutosize, Typography } from "@mui/material";
import { format } from "date-fns";
import React from "react";

export function ChatRoom() {
  const [conn, setConn] = useState<HubConnection | null>(null);
  const [room, setRoom] = useState<IChatRoom | null>(null);
  const [messages, setMessages] = useState<IMessage[] | null>(null);
  const [newMessage, setNewMessage] = useState<string>('');
  const { id } = useParams<{ id: string }>();

  const getRoomDetails = async () => {
    try {
      const response = await axiosInstance.get(`/api/chat/${id}`);
      if (response.status !== 200) {
        throw new Error("error lmao");
      }
      const roomData: IChatRoom = response.data;
      console.log(roomData);
      setRoom(roomData);
      setMessages(roomData.messages);
    } catch (err: unknown) {
      console.log(err);
    }
  }

  const joinRoom = async () => {
    const connection = new HubConnectionBuilder()
      .withUrl(`${BASE_URL}/Chat`, {
        accessTokenFactory: () => localStorage.getItem("token") || ""
      })
      .withAutomaticReconnect()
      .build();

    connection.on("UserJoined", (username: string) => {
      console.log(`${username} joined`);
    })

    connection.on("SentMessage", (msg: IMessage) => {
      setMessages((prevMessages) => prevMessages ? [...prevMessages, msg] : [msg]);
    })

    connection.onclose(() => {
      setConn(null);
    })

    await connection.start();
    await connection.invoke("JoinChat", parseInt(id!, 10));
    setConn(connection);
  }

  useEffect(() => {
    joinRoom();
    getRoomDetails();
    return () => {
      if (conn) {
        conn.stop();
      }
    }
  }, []);

  const sendMessage = async () => {
    if (!id || !conn) {
      return;
    }
    if (!newMessage.trim()) {
      return;
    }
    const newMessageObj: IMessage = {
      id: 0,
      content: newMessage,
      timestamp: new Date().toISOString(),
      chatRoomId: parseInt(id, 10),
      userId: null,
      user: null,
      chatRoom: null
    }
    try {
      await conn.invoke("SendMessage", newMessageObj);
    } catch (err: unknown) {
      console.log(err);
    }
  }

  const handleNewMessageChanghe = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const content = event.target.value;
    setNewMessage(content);
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "75vh" }}>
      {room && messages ? (
        <>
          <Typography variant="h4" gutterBottom>
            {room.name}
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              border: "1px solid #ccc",
              borderRadius: 2,
              padding: 2,
            }}
          >
            {messages.map((message: IMessage) => (
              <Card key={message.id} sx={{ marginBottom: 2 }}>
                <CardContent>
                  <Typography variant="h6">
                    {message.user ? message.user.username : "Unknown User"}
                  </Typography>
                  <Typography variant="body1">{
                    message.content.split('\n').map((line, index) => (
                      <React.Fragment key={index}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))
                  }</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {format(message.timestamp, 'dd MMM HH:mm')}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
          <Box sx={{ display: "flex", alignItems: "flex-end", gap: 2 }}>
            <TextareaAutosize
              minRows={3}
              placeholder="Type your message..."
              value={newMessage}
              onChange={handleNewMessageChanghe}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                borderColor: "#ccc",
                fontSize: "16px",
                fontFamily: "Arial, sans-serif",
                resize: "none",
                boxSizing: "border-box",
              }}
            />
            <Button variant="contained" onClick={sendMessage}>Send message</Button>
          </Box>
        </>
      ) : (
        <Typography variant="h6">Room is not initialized</Typography>
      )}
    </Box>
  );
}
