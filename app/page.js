"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link"
import { FiLogIn, FiLogOut, FiMail, FiArrowRight, FiGithub } from "react-icons/fi"
import { FaGoogle } from "react-icons/fa"

export default function HomePage() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-400 opacity-20 blur-[100px]"></div>
      </div>
      
      <header className="p-4 flex justify-between items-center">
        <div className="text-2xl font-bold tracking-tighter">
          Mail<span className="text-blue-400">Agent</span>
        </div>
      </header>

      <main className="container mx-auto flex flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-4">
          Your Personal AI Email Assistant
        </h1>
        <p className="mt-3 text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
          Harness the power of Google's Gemini AI to manage your Gmail effortlessly. Read summaries, draft replies, and send emails using natural language.
        </p>
        
        <div className="mt-12">
          {!session ? (
            <button
              onClick={() => signIn("google")}
              className="flex items-center justify-center gap-3 px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg shadow-blue-600/30"
            >
              <FaGoogle />
              Sign in with Google to Get Started
            </button>
          ) : (
            <div className="mt-6 text-center space-y-6">
              <div className="p-8 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl">
                <p className="text-xl mb-2">Welcome back, <span className="font-semibold text-blue-400">{session.user?.name || session.user?.email}!</span></p>
                <p className="text-gray-400 mb-6">You are signed in and ready to go.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/agent"
                    className="flex items-center justify-center gap-2 px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors transform hover:scale-105"
                  >
                    <FiMail />
                    <span>Open Agent</span>
                    <FiArrowRight className="ml-1" />
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="flex items-center justify-center gap-2 px-6 py-3 text-lg font-semibold text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <FiLogOut />
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-24 w-full max-w-5xl">
          <h2 className="text-3xl font-bold tracking-tighter mb-8">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-800/50 border border-gray-700 rounded-lg">
              <h3 className="text-xl font-semibold mb-2 text-blue-400">Intelligent Summaries</h3>
              <p className="text-gray-400">Get concise summaries of your recent emails instantly.</p>
            </div>
            <div className="p-6 bg-gray-800/50 border border-gray-700 rounded-lg">
              <h3 className="text-xl font-semibold mb-2 text-blue-400">AI-Powered Sending</h3>
              <p className="text-gray-400">Draft and send emails with the help of a powerful AI assistant.</p>
            </div>
            <div className="p-6 bg-gray-800/50 border border-gray-700 rounded-lg">
              <h3 className="text-xl font-semibold mb-2 text-blue-400">Secure & Private</h3>
              <p className="text-gray-400">Your data is protected with Google OAuth and never stored.</p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="mt-16 pb-8 text-center text-gray-500">
        <p>Developed by Sriram Nagandla</p>
      </footer>
    </div>
  )
}
