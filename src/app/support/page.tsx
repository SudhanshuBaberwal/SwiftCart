'use client'

import { IUser } from '@/model/user.model'
import { RootState } from '@/redux/store'
import axios from 'axios'
import Image from 'next/image'
import React, { useEffect, useState, useRef } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import {
  LuSend,
  LuUser,
  LuSparkles,
  LuMessageSquare,
  LuClock,
  LuChevronLeft,
  LuLayers,
  LuX
} from 'react-icons/lu'
import { ClipLoader } from 'react-spinners'

interface Messages {
  sender: string
  text: string
  createAt: string
}

const SupportChats = () => {
  const { userData } = useSelector((state: RootState) => state.user)
  const myId = String(userData?._id)

  const [users, setUsers] = useState<IUser[]>()
  const [activeUser, setActiveUser] = useState<IUser>()
  const [text, setText] = useState("")
  const [messages, setMessages] = useState<Messages[]>([])

  // Controls fluid layout viewport splitting on small screen sizes
  const [showChatPane, setShowChatPane] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loadingSuggestions, setLoadingSuggesstions] = useState(false)

  // Autoscroll conversation history view container smoothly on message intake updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const fetchChatUsers = async () => {
      try {
        const result = await axios.get("/api/support/active-users")
        setUsers(result.data)
      } catch (error) {
        console.error(error)
        toast.error("Failed to fetch active conversations")
      }
    }
    if (myId) fetchChatUsers()
  }, [myId])

  useEffect(() => {
    const fetchChatMessages = async () => {
      if (!activeUser?._id) return
      try {
        const result = await axios.post("/api/support/get", { withUserId: activeUser._id })
        setMessages(result.data.messages || [])
        setSuggestions([]) // Clear previous suggestions when swapping chats
      } catch (error) {
        console.error(error)
      }
    }
    fetchChatMessages()
  }, [activeUser])

  const sendMessage = async () => {
    if (!text.trim() || !activeUser) return
    const messageContent = text.trim()
    setText("") // Instant optimistic input wiping update
    setSuggestions([]) // Clear options after message is dispatched

    try {
      await axios.post("/api/support/send", {
        receiverId: activeUser._id,
        text: messageContent,
      })
      setMessages((prev) => [...prev, { sender: myId, text: messageContent, createAt: new Date().toISOString() }])
    } catch (error) {
      toast.error("Failed to deliver message")
      setText(messageContent) // Rollback string value state on catastrophic connection dropouts
      console.error(error)
    }
  }

  const getSuggestions = async () => {
    if (!messages.length || !activeUser || !userData?.role) {
      toast.error("Send or receive a message first to get contextual hints")
      return
    }
    const lastMessages = messages[messages.length - 1]
    setLoadingSuggesstions(true)
    try {
      const result = await axios.post("/api/support/AI", {
        message: lastMessages.text,
        role: userData.role,
        targetRole: activeUser.role
      })
      if (result.data.suggestions && result.data.suggestions.length > 0) {
        setSuggestions(result.data.suggestions)
      } else {
        toast.error("AI couldn't generate safe options for this context")
      }
    } catch (error) {
      console.error("error : ", error)
      toast.error("Could not load AI reply choices")
    } finally {
      setLoadingSuggesstions(false)
    }
  }

  const handleSelectUser = (user: IUser) => {
    setActiveUser(user)
    setShowChatPane(true)
  }

  if (!userData?._id) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center bg-[#09090b] text-zinc-400 gap-3'>
        <div className="w-6 h-6 rounded-full border-2 border-zinc-700 border-t-blue-500 animate-spin" />
        <span className="text-xs font-mono tracking-wider">Synchronizing secure terminal connections...</span>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#09090b] via-[#030303] to-[#09090b] p-3 sm:p-6 antialiased selection:bg-blue-500/20'>
      <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 h-[88vh] relative overflow-hidden'>

        {/* --- LEFT SIDEBAR: CONVERSATION INDEX DIRECTORY --- */}
        <div className={`bg-zinc-950/40 border border-zinc-800/60 rounded-2xl p-4 flex flex-col h-full overflow-hidden backdrop-blur-md transition-all duration-300 ${showChatPane ? 'hidden md:flex' : 'flex'
          }`}>
          <div className="flex items-center gap-2 mb-3 px-1">
            <LuMessageSquare className="text-blue-500" size={18} />
            <h2 className='text-white font-bold text-base tracking-tight'>Support Center</h2>
          </div>

          {userData?.role !== "admin" && (
            <div className='bg-amber-500/5 border border-amber-500/10 rounded-xl p-3 mb-4 flex gap-2.5 items-start'>
              <LuClock size={14} className="text-amber-400 shrink-0 mt-0.5" />
              <p className='text-[11px] text-amber-400/90 leading-relaxed font-medium'>
                {userData?.role === "user"
                  ? "Note: Vendor reply times range between 1-2 hours based on operation shifts."
                  : "Note: Corporate administrative logs respond within 1-2 system routing hours."
                }
              </p>
            </div>
          )}

          <div className='flex-1 overflow-y-auto space-y-1.5 pr-1.5 custom-scrollbar'>
            {!users || users.length === 0 ? (
              <div className="text-center py-12 text-zinc-500 space-y-2">
                <LuLayers size={20} className="mx-auto text-zinc-700" />
                <p className='text-xs font-medium'>No active dynamic logs routed.</p>
              </div>
            ) : (
              users.map((u, i) => (
                <div
                  onClick={() => handleSelectUser(u)}
                  key={u._id || i}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 relative ${activeUser?._id === u._id
                    ? "bg-blue-500/10 border border-blue-500/30 shadow-md text-white"
                    : "hover:bg-zinc-900/40 border border-transparent text-zinc-400 hover:text-zinc-200"
                    }`}
                >
                  <div className='w-10 h-10 rounded-full overflow-hidden border border-zinc-800 flex items-center justify-center shrink-0 bg-zinc-900 relative shadow-inner'>
                    {u.image ? (
                      <Image src={u.image} alt={u.name || 'User Avatar'} fill className='object-cover' sizes="40px" />
                    ) : (
                      <LuUser className='text-zinc-500' size={16} />
                    )}
                  </div>
                  <div className='min-w-0 flex-1 text-left'>
                    <p className='text-sm font-semibold truncate leading-tight text-zinc-200 group-hover:text-white'>
                      {u.name}
                    </p>
                    <p className='text-[11px] text-zinc-500 truncate font-medium mt-0.5 capitalize'>
                      {u.role === "admin" ? "System Admin Support" : u.shopName || `${u.role} Account`}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* --- RIGHT PANEL: CONVERSATION WIRESTREAM HUB --- */}
        <div className={`md:col-span-2 bg-zinc-950/40 border border-zinc-800/60 rounded-2xl flex flex-col overflow-hidden backdrop-blur-md transition-all duration-300 ${showChatPane ? 'flex' : 'hidden md:flex'
          }`}>
          {!activeUser ? (
            <div className='flex flex-1 flex-col items-center justify-center text-zinc-500 p-6 space-y-2 text-center'>
              <LuMessageSquare size={24} className="text-zinc-700 animate-pulse" />
              <h3 className="text-sm font-bold text-zinc-400">No Terminal Selected</h3>
              <p className='text-xs max-w-xs text-zinc-600 font-medium leading-normal'>Select an authenticated account route line from the active directory listing to stream communication history.</p>
            </div>
          ) : (
            <>
              {/* Active Conversation Control Top Header */}
              <div className="px-4 py-3.5 border-b border-zinc-800/60 bg-zinc-900/20 flex items-center gap-3">
                <button
                  onClick={() => setShowChatPane(false)}
                  className="md:hidden w-8 h-8 rounded-lg border border-zinc-800 bg-zinc-900/50 text-zinc-400 flex items-center justify-center shrink-0"
                >
                  <LuChevronLeft size={16} />
                </button>
                <div className='w-8 h-8 rounded-full overflow-hidden border border-zinc-800 relative bg-zinc-900 shrink-0'>
                  {activeUser.image ? (
                    <Image src={activeUser.image} alt='Target node identifier banner' fill className='object-cover' sizes="32px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-400 font-bold text-xs capitalize">{activeUser.name?.charAt(0)}</div>
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate leading-tight">{activeUser.name}</h4>
                  <p className="text-[10px] tracking-wider uppercase text-zinc-500 font-extrabold mt-0.5">{activeUser.role}</p>
                </div>
              </div>

              {/* Message Feed Display Matrix */}
              <div className='flex-1 p-4 space-y-3.5 overflow-y-auto bg-zinc-950/10 custom-scrollbar'>
                {messages.map((msg, i) => {
                  const isMe = msg.sender === myId
                  return (
                    <div key={i} className={`flex items-end gap-2.5 ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] sm:max-w-[65%] px-3.5 py-2.5 text-xs font-medium leading-relaxed rounded-xl shadow-xs ${isMe
                        ? "bg-blue-600 text-white rounded-br-none font-semibold"
                        : "bg-zinc-900/90 text-zinc-200 border border-zinc-800/40 rounded-bl-none"
                        }`}>
                        <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* --- DYNAMIC AI SUGGESTIONS WRAPPER PANEL --- */}
              <div className='px-4 pt-2 pb-1 space-y-2 bg-transparent border-t border-zinc-900/40'>
                {/* Horizontal Sliding List of Suggestions */}
                {suggestions.length > 0 && (
                  <div className="flex flex-col gap-1.5 pb-1">
                    <div className="flex justify-between items-center px-0.5">
                      <span className="text-[9px] uppercase tracking-wider font-bold text-purple-400/80 flex items-center gap-1">
                        <LuSparkles size={10} /> Smart Recommendations
                      </span>
                      <button
                        onClick={() => setSuggestions([])}
                        className="text-zinc-600 hover:text-zinc-400 transition-colors"
                      >
                        <LuX size={12} />
                      </button>
                    </div>
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 pr-4 scroll-smooth">
                      {suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => setText(suggestion)}
                          className="whitespace-nowrap bg-purple-500/5 hover:bg-purple-500/15 border border-purple-500/20 text-purple-300 text-[11px] px-3 py-1.5 rounded-xl font-medium transition-all duration-200 active:scale-95 text-left truncate max-w-[260px]"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Suggestions Control Trigger Button */}
                <button
                  onClick={getSuggestions}
                  disabled={loadingSuggestions}
                  className='inline-flex items-center gap-1.5 text-[10px] tracking-wide font-extrabold uppercase px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/15 text-purple-400 border border-purple-500/20 active:scale-98 transition-all shadow-sm disabled:opacity-50'
                >
                  {loadingSuggestions ? (
                    <>
                      <ClipLoader size={10} color="#c084fc" />
                      <span>Analyzing Context...</span>
                    </>
                  ) : (
                    <>
                      <LuSparkles size={11} className="stroke-[2.5]" />
                      <span>Get AI Suggestions</span>
                    </>
                  )}
                </button>
              </div>

              {/* Active Message Input Form Dock */}
              <div className='p-3 border-t border-zinc-800/60 bg-zinc-950/40 flex gap-2 items-center'>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder='Write a secure response entry...'
                  className='flex-1 bg-zinc-950 text-zinc-100 text-xs border border-zinc-800 focus:border-zinc-700 rounded-xl px-4 py-3 outline-none transition-colors placeholder:text-zinc-600 focus:ring-2 focus:ring-blue-500/10'
                />
                <button
                  onClick={sendMessage}
                  disabled={!text.trim()}
                  className='bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 w-10 h-10 rounded-xl flex shrink-0 justify-center items-center text-white transition-all active:scale-95 shadow-md shadow-blue-600/10'
                >
                  <LuSend size={14} className="stroke-[2.5]" />
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  )
}

export default SupportChats