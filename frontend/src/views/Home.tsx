import { useEffect, useState } from "react";
import { Select, MenuItem, FormControl, InputLabel, Container, Typography, SelectChangeEvent, Button, Box, TextField } from "@mui/material";
import axiosInstance from "../axios/axios";
import { IChatRoom } from "../types/chatRoom";
import { useNavigate } from "react-router-dom";

export function Home() {
  const [rooms, setRooms] = useState<IChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<IChatRoom | null>(null);
  const [newRoomName, setNewRoomName] = useState<string>("");
  const navigate = useNavigate();

  const fetchRooms = async () => {
    try {
      const response = await axiosInstance.get("/api/chat");
      if (response.status !== 200) {
        throw new Error(`unexpected response status: ${response.status}.\n Error message: ${response.statusText}`);
      }
      setRooms(response.data);
    } catch (err: unknown) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleChange = (event: SelectChangeEvent<number>) => {
    const roomId = parseInt(event.target.value as string, 10);
    const room = rooms.find(r => r.id === roomId) || null;
    console.log(room);
    setSelectedRoom(room);
  };

  const handleJoin = async () => {
    if (!selectedRoom) {
      return;
    }
    navigate(`/chat-room/${selectedRoom.id}`);
  }

  const handleCreateRoom = async () => {
    if (newRoomName.trim() == "") {
      return;
    }
    const newRoomObj: IChatRoom = {
      id: 0,
      name: newRoomName,
      messages: [],
      users: [],
    }
    try {
      const response = await axiosInstance.post("/api/chat/create-chat", newRoomObj);
      if (response.status == 200) {
        setNewRoomName("");
        await fetchRooms();
      }
      console.log(response);
    } catch (err: unknown) {
      console.log(err)
    }
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Select a Chat Room
      </Typography>
      <FormControl fullWidth variant="outlined" margin="normal">
        <InputLabel id="chat-room-label">Chat Room</InputLabel>
        <Select
          labelId="chat-room-label"
          value={selectedRoom?.id || ""}
          onChange={handleChange}
          label="Chat Room"
        >
          {rooms.map((room) => (
            <MenuItem key={room.id} value={room.id}>
              {room.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button variant="contained" onClick={handleJoin}>Join Room</Button>
      <Box marginTop={4}>
        <Typography variant="h5" component="h4" gutterBottom>
          Create a new chat room
        </Typography>
        <FormControl fullWidth variant="outlined" margin="normal">
          <TextField
            label="Chat room name"
            variant="outlined"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
          />
        </FormControl>
        <Button
          variant="contained"
          onClick={handleCreateRoom}
          sx={{ marginTop: 2 }}
        >
          Create room
        </Button>
      </Box>
    </Container>
  );
}
