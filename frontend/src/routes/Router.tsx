import { Route, Routes } from "react-router-dom";
import { Login } from "../views/LoginView";
import { Home } from "../views/Home";
import { Register } from "../views/Register";
import { CreateRoom } from "../views/CreateRoom";

export function Router() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-room" element={<CreateRoom />} />
      </Routes>
    </>
  )
}
