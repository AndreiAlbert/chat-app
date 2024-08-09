import { useState } from "react";
import { CustomInput } from "../components/CustomInput";
import { useAuth } from "../contexts/AuthContext";
import axiosInstance from "../axios/axios";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";

export function Login() {
  const navigator = useNavigate();
  const { token } = useAuth();
  if (token) {
    console.log("hei user is logged in");
  }
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })

  const handleChanghe = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/api/auth/login', formData);
      if (response.status !== 200) {
        throw new Error(`Unexpected response status: ${response.status}\n. Error message: ${response.statusText}`);
      }
      const { token } = response.data;
      localStorage.setItem("token", token);
      navigator("/");
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        console.log(error.response?.data);
      }
    }
  }


  return (
    <div>
      <form onSubmit={handleSubmit}>
        <CustomInput
          type="text"
          placeHolder="username"
          value=""
          name="username"
          onChanghe={handleChanghe}
        />
        <CustomInput
          type="password"
          placeHolder="password"
          value=""
          name="password"
          onChanghe={handleChanghe}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}
