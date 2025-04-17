import React, { ChangeEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../state";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const RegisterModal = ({
  toggleRegisterModal,
  isVisible,
}: {
  toggleRegisterModal: () => void;
  isVisible: boolean;
}) => {
  const [userData, setUserData] = useState<UserData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFieldChange =
    (field: keyof UserData) => (event: ChangeEvent<HTMLInputElement>) => {
      setUserData((prevData) => ({
        ...prevData,
        [field]: event.target.value,
      }));
    };

  const handleRegister = async (userData: UserData) => {
    try {
      const response = await fetch("http://localhost:3001/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Failed to register");
      }

      const registered = await response.json();

      const userResponse = await fetch("http://localhost:3001/users/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${registered.access_token}`,
        },
      });

      const registeredUser = await userResponse.json();

      console.log(registeredUser);
      dispatch(
        setUser({
          user: {
            name:
              `${registeredUser.firstName} ${registeredUser.lastName}` ||
              "User",
            avatar: "https://cdn-icons-png.flaticon.com/128/3177/3177440.png",
          },
          token: registered.access_token,
        })
      );
      navigate("/home");
    } catch (err) {
      console.log(err);
    }
  };

  const handleRegisterClick = async () => {
    await handleRegister(userData);
  };

  return (
    <div
      className={`${
        isVisible ? "animate-fade-in" : "hidden"
      } fixed inset-0 z-50 flex justify-center items-center`}
    >
      <div
        className={`relative bg-black shadow-2xl shadow-blue-500 p-4 md:p-7 max-w-lg min-w-[300px] leading-relaxed transition-all duration-300 ease-in-out transform ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div
          className="p-3 absolute top-0 right-0 cursor-pointer hover:bg-[#c70606] transition duration-300 ease-in-out"
          onClick={toggleRegisterModal}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-x-lg"
            viewBox="0 0 16 16"
          >
            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
          </svg>
        </div>
        <h1
          className="text-3xl py-3 pb-7"
          style={{ fontFamily: "Prompt", fontWeight: 500 }}
        >
          Register Now
        </h1>
        <div className="flex flex-row gap-4 mb-5">
          <input
            className="bg-black p-2 border border-gray-700 w-full shadow-sm shadow-gray-500"
            placeholder="First Name"
            onChange={handleFieldChange("firstName")}
          />
          <input
            className="bg-black p-2 border border-gray-700 w-full shadow-sm shadow-gray-500"
            placeholder="Last Name"
            onChange={handleFieldChange("lastName")}
          />
        </div>
        <div className="flex flex-col gap-y-5 pb-8">
          <input
            type="email"
            className="bg-black p-2 border border-gray-700 shadow-sm shadow-gray-500"
            placeholder="Email Address"
            onChange={handleFieldChange("email")}
          />
          <input
            type="password"
            className="bg-black p-2 border border-gray-700 shadow-sm shadow-gray-500"
            placeholder="Password"
            onChange={handleFieldChange("password")}
          />
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleRegisterClick}
            className="bg-[#345eeb] hover:bg-[#78c7ff] hover:text-black transition duration-300 ease-in-out text-white p-3 px-16 rounded-full flex items-center justify-center gap-2"
          >
            <span
              className="text-sm"
              style={{ fontFamily: "Poppins", fontWeight: 500 }}
            >
              Create Account
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;