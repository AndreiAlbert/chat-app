import { useState } from "react";
import { CustomInput } from "../components/CustomInput";
import { Button } from "../components/Button";
import { IChatRoom } from "../types/chatRoom";
import axiosInstance from "../axios/axios";
import { isAxiosError } from "axios";

export function CreateRoom() {
  const [chatRoom, setChatRoom] = useState<IChatRoom>({
    id: 0,
    name: "",
    users: [],
    messages: []
  });

  const onChangheChatRoomName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChatRoomName = e.target.value;
    setChatRoom(oldChatRoom => ({
      ...oldChatRoom,
      name: newChatRoomName,
    }));
  }

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/api/chat/create-chat", chatRoom);
      if (response.status !== 200) {
        throw new Error(`Unexpected response status: ${response.status}\n. Error message: ${response.statusText}`);
      }
      const data: IChatRoom = response.data;
      console.log(data);
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        console.log(err.response?.data);
      }
    }
  }

  return (
    <form onSubmit={submitHandler}>
      <CustomInput
        type="text"
        placeHolder="Insert chatroom name"
        value={chatRoom.name}
        name="chatroomName"
        onChanghe={onChangheChatRoomName}
      />
      <Button type="submit">Create room</Button>
    </form>
  )
}
