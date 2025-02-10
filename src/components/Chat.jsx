import React, { useEffect, useState, useRef } from "react";
import { auth, db, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, logOut } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const Chat = () => {
  const [user] = useAuthState(auth);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    await addDoc(collection(db, "messages"), {
      text,
      uid: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: serverTimestamp(),
    });

    setText("");
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="w-full max-w-2xl flex flex-col h-[85vh] bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-blue-500 text-white p-4 flex justify-between items-center">
        <h2 className="text-xl">Chat Room</h2>
        <button onClick={logOut} className="bg-red-500 px-3 py-1 rounded">Logout</button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.uid === user.uid ? "justify-end" : "justify-start"}`}>
            <div className="flex items-center space-x-2">
              {msg.uid !== user.uid && <img src={msg.photoURL} alt="user" className="w-8 h-8 rounded-full" />}
              <div className={`p-3 rounded-lg ${msg.uid === user.uid ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input Box */}
      <form onSubmit={sendMessage} className="p-4 bg-gray-100 flex">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-l"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 rounded-r">Send</button>
      </form>
    </div>
  );
};

export default Chat;
