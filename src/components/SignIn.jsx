import React from "react";
import { signIn } from "../firebase";

const SignIn = () => {
  return (
    <div className="flex flex-col items-center mt-20">
      <h1 className="text-2xl font-bold mb-4">Welcome to Chat App</h1>
      <button
        onClick={signIn}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg text-lg shadow-md"
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default SignIn;
