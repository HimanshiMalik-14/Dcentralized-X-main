import { useState } from "react";
import logo from "../assets/logo.jpg";
import googlelogo from "../assets/google.png";
import metamasklogo from "../assets/metamask.png";
import RegisterModal from "../components/Overlay/RegisterModal";
import LoginModal from "../components/Overlay/LoginModal";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
  const { handleGoogleAuth, connectWallet } = useAuth();
  localStorage.setItem("userID", "");
  const [registerModal, setRegisterModal] = useState(false);
  const [loginModal, setLoginModal] = useState(false);

  const toggleRegisterModal = () => {
    setRegisterModal(!registerModal);
  };

  const toggleLoginModal = () => {
    setLoginModal(!loginModal);
  };

  return (
    <>
      {registerModal && (
        <RegisterModal
          toggleRegisterModal={toggleRegisterModal}
          isVisible={registerModal}
        />
      )}
      {loginModal && (
        <LoginModal
          toggleLoginModal={toggleLoginModal}
          isVisible={loginModal}
        />
      )}
      <div className="w-full h-screen flex flex-col md:flex-row p-2">
        <ToastContainer
          bodyClassName={() =>
            "text-sm text-black font-white font-med block p-3"
          }
        />
        <div className="w-full md:w-1/2 h-1/3 md:h-screen flex items-center justify-center">
          <img src={logo} alt="logo" className="w-3/4 md:w-auto" />
        </div>
        <div className="w-full md:w-1/2 h-1/3 md:h-screen flex items-center justify-center">
          <div className="flex flex-col items-start text-center md:text-left px-4 md:px-0">
            <div
              className="text-3xl md:text-7xl p-4 m-2 mt-52 md:mt-0"
              style={{ fontFamily: "Bebas Neue" }}
            >
              Decentralize your voice
            </div>
            <div
              className="text-xl md:text-3xl p-4 m-2"
              style={{ fontFamily: "Prompt", fontWeight: 600 }}
            >
              Get started today
            </div>
            <div className="flex flex-col px-4 m-2 gap-y-2">
              <button
                onClick={handleGoogleAuth}
                className="bg-white hover:bg-[#78c7ff] transtion duration-300 ease-in-out text-black p-3 md:px-16 rounded-full flex items-center justify-center md:justify-start gap-2"
              >
                <img src={googlelogo} width={20} alt="google" />
                <span
                  className="text-sm"
                  style={{ fontFamily: "Poppins", fontWeight: 500 }}
                >
                  Sign up with Google
                </span>
              </button>
              <button
                onClick={connectWallet}
                className="bg-white hover:bg-[#59ffa1] transtion duration-300 ease-in-out text-black p-3 md:px-16 mb-6 rounded-full flex items-center justify-center md:justify-start gap-2"
              >
                <img src={metamasklogo} width={20} alt="metamask" />
                <span
                  className="text-sm"
                  style={{ fontFamily: "Poppins", fontWeight: 500 }}
                >
                  Sign up with MetaMask
                </span>
              </button>
              <button
                className="bg-[#345eeb] hover:bg-[#78c7ff] hover:text-black transition duration-300 ease-in-out text-white p-3 md:px-16 rounded-full flex items-center justify-center gap-2"
                onClick={toggleRegisterModal}
              >
                <span
                  className="text-sm"
                  style={{ fontFamily: "Poppins", fontWeight: 500 }}
                >
                  Register
                </span>
              </button>
              <p className="p-3 text-sm" style={{ fontFamily: "Poppins" }}>
                Already have an Account?{" "}
                <span
                  onClick={toggleLoginModal}
                  className="text-[#78c7ff] hover:cursor-pointer hover:text-[#006eff] transtion duration-300 ease-in-out"
                >
                  Sign in
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;