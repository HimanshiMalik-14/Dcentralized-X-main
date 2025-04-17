import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import LeftSideBar from "./components/Sidebar/LeftSideBar";
import ExplorePage from "./pages/ExplorePage";
import ProfilePage from "./pages/ProfilePage";
import TweetThread from "./components/Layout/TweetThread";
import Bookmarks from "./components/Layout/Bookmarks";
import RightSideBar from "./components/Sidebar/RightSideBar";
// import { useSelector } from "react-redux";
// import { RootState } from "./store";

const AppLayout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  return (
    <div className="flex">
      {!isLoginPage && <LeftSideBar />}
      <div className={`flex-grow ${!isLoginPage ? "ml-20 lg:ml-80" : ""}`}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:userID" element={<ProfilePage />} />
          <Route path="/:userID/status/:id" element={<TweetThread />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
        </Routes>
      </div>

      {!isLoginPage && (
        <div className="hidden lg:block lg:w-[20rem] xl:w-[30rem]">
          <RightSideBar />
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </div>
  );
}

export default App;