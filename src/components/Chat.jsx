import React, { useEffect, useState, useRef } from "react";
import { auth, db, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, getDocs } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { IoIosCall } from "react-icons/io";
import { MdVideoCall } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import { MdAttachFile } from "react-icons/md";

const Chat = () => {
  const [user] = useAuthState(auth);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const messagesEndRef = useRef(null);

  // Fetch users and exclude logged-in user
  useEffect(() => {
    const fetchUsers = async () => {
      const usersSnapshot = await getDocs(collection(db, "users"));
      setUsers(
        usersSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(u => u.id !== user?.uid) // 🔥 Exclude the logged-in user
      );
    };
    fetchUsers();
  }, [user]);

  // Fetch messages only between logged-in user and selected user
  useEffect(() => {
    if (!selectedUser) return;

    const q = query(collection(db, "messages"), orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const filteredMessages = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(msg =>
          (msg.sender === user.uid && msg.receiver === selectedUser.id) ||
          (msg.sender === selectedUser.id && msg.receiver === user.uid)
        ); // 🔥 Show only messages between selected and logged-in user

      setMessages(filteredMessages);
    });

    return () => unsubscribe();
  }, [selectedUser, user]);

  // Send message function
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() || !selectedUser) return;

    await addDoc(collection(db, "messages"), {
      text,
      sender: user.uid,
      receiver: selectedUser.id,
      createdAt: serverTimestamp(),
    });

    setText("");
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* User List */}
      <div className="w-1/4 bg-white p-4 border-r overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Users</h2>
        {users.map((u) => (
          <div 
            key={u.id} 
            className="flex items-center p-2 cursor-pointer hover:bg-gray-200" 
            onClick={() => setSelectedUser(u)}
          >
            <img src={u.photoURL} alt="User" className="w-10 h-10 rounded-full mr-2" />
            <p>{u.displayName}</p>
          </div>
        ))}
      </div>

      {/* Chat Window */}
      <div className="w-3/4 flex flex-col h-screen bg-white shadow-lg">
        {/* Header */}
        <div className="bg-blue-500 text-white p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">{selectedUser ? selectedUser.displayName : "Select a user"}</h2>
          <div className="flex space-x-3">
            <button className="p-2 bg-white/20 rounded-full"><IoIosCall /></button>
            <button className="p-2 bg-white/20 rounded-full"><MdVideoCall /></button>
            <button onClick={() => auth.signOut()} className="p-2 bg-red-500 rounded-full text-white"><IoLogOut /></button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === user.uid ? "justify-end" : "justify-start"} mb-2`}>
              {msg.sender !== user.uid && (
                <img src={selectedUser.photoURL} alt="User" className="w-8 h-8 rounded-full mr-2" />
              )}
              <div className={`p-3 max-w-[60%] rounded-lg shadow ${msg.sender === user.uid ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>

        {/* Input Box */}
        <form onSubmit={sendMessage} className="p-3 bg-white flex items-center border-t">
          <label htmlFor="file-upload" className="p-2 bg-gray-200 rounded-full cursor-pointer">
            <MdAttachFile />
          </label>
          <input id="file-upload" type="file" className="hidden" />
          <input 
            type="text" 
            value={text} 
            onChange={(e) => setText(e.target.value)} 
            placeholder="Type a message..." 
            className="flex-1 p-2 border rounded-full text-sm outline-none bg-gray-100 mx-2" 
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-full">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
