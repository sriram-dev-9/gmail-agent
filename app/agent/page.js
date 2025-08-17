"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { FiSend, FiTrash2, FiHome, FiUser, FiMessageSquare, FiLoader } from "react-icons/fi"
import { FaRobot } from "react-icons/fa"

export default function AgentPage() {
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/")
    },
  })
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const storedMessages = localStorage.getItem("chatHistory")
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages))
    } else {
      setMessages([
        {
          id: "init",
          text: "Hello! I'm your personal Gmail agent, powered by Google's Gemini AI. How can I assist you today? Feel free to ask me to read your latest emails or compose a new one for you.",
          sender: "agent",
        },
      ])
    }
  }, [])

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatHistory", JSON.stringify(messages))
    }
  }, [messages])

  const handleSend = async () => {
    if (input.trim() === "" || !session) return
    const userMessage = { id: Date.now(), text: input, sender: "user" }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: input,
          accessToken: session.accessToken,
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || `HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      const agentMessage = {
        id: Date.now() + 1,
        text: data.response,
        sender: "agent",
      }
      setMessages((prev) => [...prev, agentMessage])
    } catch (error) {
      console.error("Error processing request:", error)
      const errorMessage = {
        id: Date.now() + 1,
        text: `Sorry, I encountered an error: ${error.message}`,
        sender: "agent",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: "init",
        text: "Hello! I'm your personal Gmail agent, powered by Google's Gemini AI. How can I assist you today? Feel free to ask me to read your latest emails or compose a new one for you.",
        sender: "agent",
      },
    ])
    localStorage.removeItem("chatHistory")
  }

  if (status === "loading") {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="flex flex-col w-full max-w-5xl mx-auto my-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl">
        <header className="p-4 border-b border-gray-700 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FiMessageSquare className="text-blue-400 text-2xl" />
            <div>
              <h2 className="text-xl font-bold tracking-tighter">MailAgent Chat</h2>
              <p className="text-sm text-gray-400">Connected as {session?.user?.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={clearChat}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <FiTrash2 />
              Clear
            </button>
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiHome />
              Home
            </button>
          </div>
        </header>
        
        <main className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-4 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "agent" && (
                  <div className="w-8 h-8 flex-shrink-0 bg-blue-500 rounded-full flex items-center justify-center">
                    <FaRobot className="text-white" />
                  </div>
                )}
                <div
                  className={`p-4 rounded-2xl max-w-xl whitespace-pre-wrap shadow-lg ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-700 text-gray-200 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
                {msg.sender === "user" && (
                  <div className="w-8 h-8 flex-shrink-0 bg-gray-600 rounded-full flex items-center justify-center">
                    <FiUser className="text-white" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-4 justify-start">
                <div className="w-8 h-8 flex-shrink-0 bg-blue-500 rounded-full flex items-center justify-center">
                  <FaRobot className="text-white" />
                </div>
                <div className="bg-gray-700 text-gray-200 p-4 rounded-2xl rounded-bl-none">
                  <div className="flex items-center gap-3">
                    <FiLoader className="animate-spin" />
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </main>
        
        <footer className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-2 bg-gray-700 rounded-lg p-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              className="flex-1 p-3 bg-transparent rounded-lg focus:outline-none resize-none text-white placeholder-gray-400"
              placeholder="Ask me to read emails or send one..."
              disabled={isLoading}
              rows={1}
            />
            <button
              onClick={handleSend}
              className="p-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400/50 disabled:cursor-not-allowed transition-colors"
              disabled={isLoading || input.trim() === ""}
            >
              <FiSend className="text-xl" />
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}
