import React from "react";
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Chat from "./components/Chat";
import SignIn from "./components/SignIn";

const App = () => {
  const [user] = useAuthState(auth);

  return (
    <div className="h-screen flex flex-col items-center bg-gray-100">
      <header className="w-full p-4 bg-blue-500 text-white text-center text-2xl font-bold">
        Chat App
      </header>
      {user ? <Chat /> : <SignIn />}
    </div>
  );
};

export default App;
