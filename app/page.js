"use client";
import { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ArrowUp, Users } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
  const MODEL_NAME = "gemini-2.5-flash";

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = { text: userInput, role: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setUserInput("");
    setLoading(true);
    try {
      const result = await model.generateContent(userInput);
      const botMessage = { text: result.response.text(), role: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setError("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const messagesEndRef = useRef(null);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-2">
      <div className="flex flex-col justify-between w-full h-[80vh] max-w-xl rounded-xl bg-pink-50 font-sans shadow-lg">
        {/* Chat Bot header */}
        <div className="flex justify-between items-center p-2 rounded-t-xl bg-gradient-to-r from-emerald-600 to-green-600">
          <div className="flex items-center">
            <Image
              src="https://www.sual.ai/images/2.svg"
              alt="Chat Bot"
              width={60}
              height={60}
              className="sm:w-[80px] sm:h-[80px] md:w-[100px] md:h-[100px]"
            />
            <div className="ml-2">
              <div className="font-bold text-black text-sm sm:text-base md:text-lg">
                Ai Chat Assistant
              </div>
              <div className="text-xs text-gray-600">Ask me anything</div>
            </div>
          </div>
          <div className="flex items-center justify-center text-black text-xs sm:text-sm bg-gradient-to-br from-emerald-50 to-green-50 h-8 sm:h-10 w-20 sm:w-24 rounded">
            Dashboard
          </div>
        </div>

        {/* Chat bot body */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-emerald-50 to-green-50 p-2 sm:p-4">
          {messages.map((msg, index) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={index}
                className={`flex p-2 m-2 text-sm rounded-lg max-w-[80%] ${
                  isUser
                    ? "self-end ml-auto flex-row-reverse"
                    : "self-start mr-auto flex-row"
                }`}
                style={{ width: "fit-content" }}
              >
                {/* Avatar */}
                <div
                  className={`flex items-center justify-center h-8 w-8 rounded-full text-white font-bold ${
                    isUser ? "bg-green-300 ml-2" : "bg-green-300 mr-2"
                  }`}
                >
                  {isUser ? "Y" : <Users className="h-5 w-5" />}
                </div>

                {/* Message */}
                <div
                  className={`p-2 rounded-lg flex ${
                    isUser ? " text-black" : "bg-white text-black"
                  }`}
                >
                  <div ref={messagesEndRef}>{msg.text}</div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="p-2 m-2 rounded-lg inline-flex items-center space-x-1 max-w-[80%] bg-gray-200 text-gray-700">
              <span className="h-2 w-2 bg-gray-600 rounded-full animate-pulse"></span>
              <span
                className="h-2 w-2 bg-gray-600 rounded-full animate-pulse"
                style={{ animationDelay: "200ms" }}
              ></span>
              <span
                className="h-2 w-2 bg-gray-600 rounded-full animate-pulse"
                style={{ animationDelay: "400ms" }}
              ></span>
            </div>
          )}

          {error && (
            <div className="p-4 m-2 rounded-lg max-w-[80%] bg-red-500 text-white">
              {error}
            </div>
          )}
        </div>

        {/* Chat bot footer */}
        <div className="p-4 border-t rounded-b-xl bg-gradient-to-r from-emerald-600 to-green-600">
          <div className="relative w-full">
            <input
              className="rounded-full p-3 text-sm w-full bg-gray-100 text-black pr-10"
              type="text"
              placeholder="Message HR Assistant"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button
              onClick={handleSendMessage}
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black text-white p-2 rounded-full hover:bg-gray-800 transition"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
