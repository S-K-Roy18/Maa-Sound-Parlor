"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, MessageSquare, AlertCircle } from "lucide-react";
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
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Load username from local storage
  useEffect(() => {
    const savedName = localStorage.getItem("duniya_chat_name");
    if (savedName) {
      setUserName(savedName);
    }
  }, []);

  // Fetch initial messages and set up real-time subscription
  useEffect(() => {
    if (!isOpen) return;

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
        }
      } catch (err: any) {
        console.error("Error fetching messages:", err);
        if (isMounted) setError("Chat अभी थोड़ा आराम कर रहा है...");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchMessages();

    // Subscribe to new messages
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
          setMessages((prev) => [...prev, newMsg]);
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [isOpen]);

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

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Chat Button
  if (!isOpen) {
    return (
      <motion.button
        onClick={() => setIsOpen(true)}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-6 px-5 py-2.5 bg-black/40 backdrop-blur-md border border-white/20 rounded-full flex items-center gap-2 text-brand-cream/90 hover:text-white hover:bg-black/60 transition-all shadow-xl pointer-events-auto group"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-amber opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-amber"></span>
        </span>
        <span className="font-hindi text-sm tracking-widest font-medium uppercase mt-0.5">Live Chat</span>
      </motion.button>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-12 z-50 flex items-center justify-center sm:items-end sm:justify-end pointer-events-auto px-4 py-8 sm:p-0"
        >
          <div className="w-full max-w-md sm:w-[400px] h-[75vh] sm:h-[600px] bg-black/75 backdrop-blur-2xl border border-white/10 sm:rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden relative">
            
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-black/20">
              <div className="flex items-center gap-2 text-white/90">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-amber opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-amber"></span>
                </span>
                <span className="font-hindi font-medium tracking-wide uppercase text-sm mt-0.5">Live Chat</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/50 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
              {isLoading ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="animate-spin w-6 h-6 border-2 border-brand-amber border-t-transparent rounded-full" />
                </div>
              ) : error ? (
                <div className="flex-1 flex flex-col items-center justify-center text-white/50 gap-2">
                  <AlertCircle className="w-8 h-8 opacity-50" />
                  <p className="font-hindi text-sm text-center">{error}</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-white/30 gap-3">
                  <MessageSquare className="w-8 h-8 opacity-40" />
                  <p className="font-hindi text-sm text-center">अभी यहाँ सन्नाटा है...<br/>कुछ कहना चाहोगे?</p>
                </div>
              ) : (
                messages.map((msg) => {
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
            <div className="p-4 bg-black/40 border-t border-white/10 relative">
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
                  className="flex-1 bg-white/5 border border-white/10 rounded-full pl-5 pr-12 py-3 text-white font-hindi text-sm focus:outline-none focus:border-white/30 transition-colors placeholder:text-white/30"
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
              <div className="mt-2 text-right">
                <span className={`text-[10px] ${newMessage.length >= 300 ? 'text-red-400' : 'text-white/20'}`}>
                  {newMessage.length}/300
                </span>
              </div>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
