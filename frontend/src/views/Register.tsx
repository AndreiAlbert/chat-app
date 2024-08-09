import { useState } from "react";
import { CustomInput } from "../components/CustomInput";
import { useAuth } from "../contexts/AuthContext";
import { isAxiosError } from "axios";
import axiosInstance from "../axios/axios";
import { useNavigate } from "react-router-dom";

export function Register() {
  const navigate = useNavigate();
  const { token } = useAuth();
  if (token) {
    console.log('hei user is logged in');
  }
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
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
    const { username, password } = formData;
    try {
      const response = await axiosInstance.post('/api/auth/register', { username, password });
      if (response.status !== 200) {
        throw new Error(`Unexpected response status: ${response.status}\n. Error message: ${response.statusText}`);
      }
      const { token } = response.data;
      localStorage.setItem("token", token);
      navigate("/");
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
        <CustomInput
          type="password"
          placeHolder="confirm password"
          value=""
          name="confirmPassword"
          onChanghe={handleChanghe}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  )
}
