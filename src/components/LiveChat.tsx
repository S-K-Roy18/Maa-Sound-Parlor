"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, MessageSquare, AlertCircle, Trash2, History } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ChatMessage {
  id: string;
  name: string;
  message: string;
  created_at: string;
}

export function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [userName, setUserName] = useState("");
  
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [tempMessage, setTempMessage] = useState("");
  const [inputName, setInputName] = useState("");
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Unread and history state
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [clearedAt, setClearedAt] = useState<number | null>(null);
  
  // Refs for realtime callbacks
  const isOpenRef = useRef(isOpen);
  const hasOpenedOnceRef = useRef(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    isOpenRef.current = isOpen;
    hasOpenedOnceRef.current = hasOpenedOnce;
  }, [isOpen, hasOpenedOnce]);

  useEffect(() => {
    if (isOpen) {
      if (!hasOpenedOnce) {
        setHasOpenedOnce(true);
        localStorage.setItem("duniya_chat_opened", "true");
      }
      setUnreadCount(0);
      localStorage.setItem("duniya_chat_unread", "0");
      setTimeout(scrollToBottom, 100);
    }
  }, [isOpen, hasOpenedOnce]);

  // Load state from local storage on mount
  useEffect(() => {
    const savedName = localStorage.getItem("duniya_chat_name");
    if (savedName) setUserName(savedName);

    const opened = localStorage.getItem("duniya_chat_opened");
    if (opened) setHasOpenedOnce(true);

    const unread = localStorage.getItem("duniya_chat_unread");
    if (unread) setUnreadCount(parseInt(unread, 10));

    const cleared = localStorage.getItem("duniya_chat_cleared_at");
    if (cleared) setClearedAt(parseInt(cleared, 10));
  }, []);

  // Fetch initial messages and set up real-time subscription globally
  useEffect(() => {
    let isMounted = true;

    const fetchMessages = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from("duniya_global_chat")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(100);

        if (error) throw error;
        
        if (isMounted && data) {
          // Reverse so newest is at bottom
          setMessages(data.reverse());
          setTimeout(scrollToBottom, 100);
        }
      } catch (err: any) {
        console.error("Error fetching messages:", err);
        if (isMounted) setError("Chat अभी थोड़ा आराम कर रहा है...");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchMessages();

    // Subscribe to new messages regardless of whether modal is open
    const channel = supabase
      .channel("global_chat")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "duniya_global_chat",
        },
        (payload) => {
          const newMsg = payload.new as ChatMessage;
          setMessages((prev) => {
            const newArray = [...prev, newMsg];
            // keep up to 200 locally
            if (newArray.length > 200) return newArray.slice(newArray.length - 200);
            return newArray;
          });
          
          if (!isOpenRef.current && hasOpenedOnceRef.current) {
            setUnreadCount(prev => {
              const newCount = prev + 1;
              localStorage.setItem('duniya_chat_unread', newCount.toString());
              return newCount;
            });
          } else if (isOpenRef.current) {
            setTimeout(scrollToBottom, 100);
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const msgTrimmed = newMessage.trim();
    if (!msgTrimmed) return;
    
    if (msgTrimmed.length > 300) {
      // Basic client-side validation
      return;
    }

    if (!userName) {
      setTempMessage(msgTrimmed);
      setShowNamePrompt(true);
      return;
    }

    await publishMessage(userName, msgTrimmed);
    setNewMessage("");
  };

  const handleTrash = () => {
    const now = Date.now();
    setClearedAt(now);
    localStorage.setItem("duniya_chat_cleared_at", now.toString());
  };

  const handleHistory = () => {
    setClearedAt(null);
    localStorage.removeItem("duniya_chat_cleared_at");
    setTimeout(scrollToBottom, 100);
  };

  const publishMessage = async (name: string, msg: string) => {
    try {
      const { error } = await supabase
        .from("duniya_global_chat")
        .insert([{ name, message: msg }]);
        
      if (error) {
        console.error("Error sending message:", error);
      }
    } catch (err) {
      console.error("Failed to publish:", err);
    }
  };

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameTrimmed = inputName.trim();
    if (!nameTrimmed) return;

    setUserName(nameTrimmed);
    localStorage.setItem("duniya_chat_name", nameTrimmed);
    setShowNamePrompt(false);
    
    if (tempMessage) {
      await publishMessage(nameTrimmed, tempMessage);
      setNewMessage("");
      setTempMessage("");
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const displayedMessages = messages.filter(msg => {
    if (!clearedAt) return true;
    return new Date(msg.created_at).getTime() > clearedAt;
  });

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* The Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative mt-4 sm:mt-6 px-4 py-2 sm:px-5 sm:py-2.5 bg-black/40 backdrop-blur-md border border-white/20 rounded-full flex items-center gap-2 text-brand-cream/90 hover:text-white hover:bg-black/60 transition-all shadow-xl pointer-events-auto group"
        style={{ display: isOpen ? 'none' : 'flex' }}
      >
        <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-amber opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-brand-amber"></span>
        </span>
        <span className="font-hindi text-xs sm:text-sm tracking-widest font-medium uppercase mt-0.5">Live Chat</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold px-1.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center shadow-lg border border-red-400">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </motion.button>

      {/* The Modal in a Portal to escape CSS transforms from WorldTitle */}
      {mounted && typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              // Mobile: precise exact bounding box between TopBar and MusicPlayer
              className="fixed top-[90px] left-3 right-3 bottom-[230px] sm:top-auto sm:left-auto sm:right-8 sm:bottom-24 z-50 flex flex-col justify-end pointer-events-none"
            >
              {/* Pointer-events-auto applied only to the visible box */}
              <div className="w-full h-full sm:w-[350px] sm:h-[450px] bg-black/75 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden relative pointer-events-auto">
                  
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-black/20 shrink-0">
                    <div className="flex flex-col justify-center">
                      <div className="flex items-center gap-2 text-white/90">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-amber opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-amber"></span>
                        </span>
                        <span className="font-hindi font-medium tracking-wide uppercase text-sm mt-0.5">Live Chat</span>
                      </div>
                      <span className="font-hindi text-[11px] text-white/40 mt-0.5 ml-4 leading-none">
                        यहाँ हर कोई थोड़ा अपना है।
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={handleTrash}
                        title="Clear chat"
                        aria-label="Clear chat"
                        className="text-white/40 hover:text-red-400 transition-colors p-1.5 rounded-full hover:bg-white/5"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={handleHistory}
                        disabled={!clearedAt}
                        title="Chat history"
                        aria-label="Chat history"
                        className="text-white/40 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white/40"
                      >
                        <History className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setIsOpen(false)}
                        title="Close chat"
                        aria-label="Close chat"
                        className="text-white/50 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/5 ml-1"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                    {isLoading ? (
                      <div className="flex-1 flex items-center justify-center">
                        <div className="animate-spin w-6 h-6 border-2 border-brand-amber border-t-transparent rounded-full" />
                      </div>
                    ) : error ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-white/50 gap-2">
                        <AlertCircle className="w-8 h-8 opacity-50" />
                        <p className="font-hindi text-sm text-center">{error}</p>
                      </div>
                    ) : displayedMessages.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-white/30 gap-3">
                        <MessageSquare className="w-8 h-8 opacity-40" />
                        <p className="font-hindi text-sm text-center">अभी यहाँ सन्नाटा है...<br/>कुछ कहना चाहोगे?</p>
                      </div>
                    ) : (
                      displayedMessages.map((msg) => {
                        const isMe = userName && msg.name === userName;
                        return (
                          <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                            {!isMe && (
                              <span className="text-[10px] text-white/40 mb-1 ml-1 uppercase tracking-wider font-semibold">
                                {msg.name}
                              </span>
                            )}
                            <div className={`px-4 py-2.5 rounded-2xl max-w-[85%] break-words ${isMe ? 'bg-brand-amber text-black rounded-tr-sm' : 'bg-white/10 text-white rounded-tl-sm'}`}>
                              <p className={`font-hindi text-sm leading-relaxed ${isMe ? 'font-medium' : ''}`}>
                                {msg.message}
                              </p>
                            </div>
                            <span className={`text-[10px] text-white/30 mt-1 ${isMe ? 'mr-1' : 'ml-1'}`}>
                              {formatTime(msg.created_at)}
                            </span>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area / Name Prompt Overlay */}
                  <div className="p-3 bg-black/40 border-t border-white/10 relative shrink-0">
                    <AnimatePresence>
                      {showNamePrompt && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          className="absolute inset-0 bg-black/95 backdrop-blur-md z-10 flex flex-col justify-center px-6"
                        >
                          <p className="text-brand-amber font-hindi text-sm mb-3 text-center">पहले अपना नाम बताओ</p>
                          <form onSubmit={handleNameSubmit} className="flex gap-2">
                            <input
                              type="text"
                              value={inputName}
                              onChange={(e) => setInputName(e.target.value)}
                              placeholder="तुम्हारा नाम..."
                              className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white font-hindi text-sm focus:outline-none focus:border-brand-amber/50"
                              maxLength={20}
                              autoFocus
                            />
                            <button 
                              type="submit"
                              disabled={!inputName.trim()}
                              className="bg-brand-amber text-black px-4 py-2 rounded-full font-hindi text-sm font-bold disabled:opacity-50 transition-opacity"
                            >
                              चलो
                            </button>
                          </form>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <form onSubmit={handleSendMessage} className="flex gap-2 relative">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value.slice(0, 300))}
                        placeholder="Type a message..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-full pl-4 pr-12 py-2 text-white font-hindi text-sm focus:outline-none focus:border-white/30 transition-colors placeholder:text-white/30"
                        disabled={showNamePrompt || isLoading}
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim() || showNamePrompt || isLoading}
                        className="absolute right-1 top-1 bottom-1 aspect-square bg-brand-amber text-black rounded-full flex items-center justify-center hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:hover:bg-brand-amber"
                      >
                        <Send className="w-4 h-4 ml-[-2px]" />
                      </button>
                    </form>
                    <div className="mt-1 text-right h-3">
                      <span className={`text-[9px] ${newMessage.length >= 300 ? 'text-red-400' : 'text-white/20'}`}>
                        {newMessage.length}/300
                      </span>
                    </div>
                  </div>

                </div>
              </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
