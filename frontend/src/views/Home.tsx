import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";

export function Home() {
  const navigate = useNavigate();
  return (
    <Button
      onClick={() => navigate("/create-room")}
    >
      Create chat room
    </Button>
  )
}
