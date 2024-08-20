import { Route, Routes } from "react-router-dom";
import { Login } from "../views/Login";
import { Register } from "../views/Register";
import { Home } from "../views/Home";
import { ChatRoom } from "../views/ChatRoom";
import { Header } from "../components/Header";

export function Router() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat-room/:id" element={<ChatRoom />} />
      </Routes>
    </>
  )
}
