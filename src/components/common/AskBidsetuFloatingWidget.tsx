"use client";

import { useState, useEffect, useRef } from "react";
import { Sparkles, X, Send, Bot, Headphones } from "lucide-react";

export default function AskBidsetuFloatingWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    {
      sender: "ai",
      text: "Namaste! I am BidSetu AI Assistant. Ask me about active tenders, GST/PAN statutory verification, GFR 2017 rules, or bid compliance scoring.",
    },
  ]);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, isTyping, isOpen]);

  const handleSend = (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const textToSend = (customQuery || query).trim();
    if (!textToSend) return;

    setChatMessages((prev) => [...prev, { sender: "user", text: textToSend }]);
    if (!customQuery) setQuery("");
    setIsTyping(true);

    setTimeout(() => {
      let response = "BidSetu AI: I am analyzing your request against CPPP & GFR 2017 guidelines. You can verify tender eligibility, statutory GSTIN status, or check bid risk scoring in your Workspace.";
      const lower = textToSend.toLowerCase();

      if (lower.includes("gst") || lower.includes("pan") || lower.includes("statutory") || lower.includes("lookup")) {
        response = "DATASETU Statutory Gateway: Active GSTIN filing status, PAN legal entity match, and MCA company registration can be verified under the Statutory Verification network.";
      } else if (lower.includes("tender") || lower.includes("bids") || lower.includes("solar") || lower.includes("active")) {
        response = "Procurement Intelligence: TND-2026-MNRE-0842 (500MW Solar PV EPC) & TND-2026-MEITY-0194 (AI Cloud Infrastructure) are currently open for submission.";
      } else if (lower.includes("rule") || lower.includes("gfr") || lower.includes("make in india") || lower.includes("dcr")) {
        response = "GFR 2017 & DCR Directives: Class-I local suppliers must have minimum 50% local content percentage under Rule 144(xi). Attach DCR OEM certificate to claim eligibility waiver.";
      } else if (lower.includes("risk") || lower.includes("audit") || lower.includes("cvc")) {
        response = "Risk Intelligence: BidSetu automatically parses blacklisting databases, bid-rigging collusion indicators, and generates an immutable CVC audit trail report.";
      }

      setChatMessages((prev) => [...prev, { sender: "ai", text: response }]);
      setIsTyping(false);
    }, 450);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* FLOATING DIALOG CHAT WINDOW */}
      {isOpen && (
        <div className="mb-4 w-96 max-w-[calc(100vw-32px)] bg-white rounded-2xl border border-[#c9ddec] shadow-2xl overflow-hidden flex flex-col h-[480px] animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* HEADER */}
          <div className="bg-gradient-to-r from-[#003c6c] to-[#00599f] text-white p-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
                <Sparkles size={18} className="text-[#f39a21]" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm leading-tight">Ask BidSetu AI</h4>
                <p className="text-[11px] text-[#c9ddec]">Official Procurement & Verification Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* CHAT MESSAGES BODY */}
          <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#f8fafc] text-xs">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "ai" && (
                  <div className="w-7 h-7 rounded-full bg-[#00599f] text-white flex items-center justify-center shrink-0 text-[10px] font-bold">
                    AI
                  </div>
                )}
                <div
                  className={`p-3 rounded-xl max-w-[82%] leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-[#00599f] text-white rounded-tr-none font-medium shadow-xs"
                      : "bg-white text-[#1a1a1a] border border-[#dce5ed] rounded-tl-none shadow-2xs"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-full bg-[#00599f] text-white flex items-center justify-center shrink-0 text-[10px] font-bold">
                  AI
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#dce5ed] rounded-tl-none text-[#5f6368] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00599f] animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00599f] animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00599f] animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
          </div>

          {/* QUICK PROMPT CHIPS */}
          <div className="px-3 py-2 bg-white border-t border-[#edf2f7] flex gap-1.5 overflow-x-auto text-[10.5px]">
            <button
              onClick={() => handleSend(undefined, "Check Active Tenders")}
              className="bg-[#e7edf5] hover:bg-[#c9ddec] text-[#00599f] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer"
            >
              Active Tenders
            </button>
            <button
              onClick={() => handleSend(undefined, "GSTIN Verification Gateway")}
              className="bg-[#e7edf5] hover:bg-[#c9ddec] text-[#00599f] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer"
            >
              GSTIN Lookup
            </button>
            <button
              onClick={() => handleSend(undefined, "GFR 2017 DCR Rules")}
              className="bg-[#fdf1e7] hover:bg-[#fae2d0] text-[#D96C24] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer"
            >
              DCR Rules
            </button>
          </div>

          {/* CHAT INPUT FORM */}
          <form onSubmit={(e) => handleSend(e)} className="p-3 bg-white border-t border-[#dce5ed] flex items-center gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about tenders, GST, DCR or bid risk..."
              className="flex-1 text-xs px-3.5 py-2.5 border border-[#dce5ed] rounded-xl focus:outline-none focus:border-[#00599f] text-[#1a1a1a]"
            />
            <button
              type="submit"
              className="bg-[#00599f] hover:bg-[#003c6c] text-white p-2.5 rounded-xl transition-colors shrink-0 cursor-pointer"
              title="Send Prompt"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}

      {/* FLOATING ACTION BUTTON WITH GREEN ACTIVE DOT */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group bg-[#0057a8] hover:bg-[#004278] text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all transform hover:scale-105 cursor-pointer border-2 border-white"
        title="Ask BidSetu AI"
      >
        <Sparkles size={24} className="text-[#f39a21]" />
        {/* GREEN ONLINE INDICATOR DOT */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-[#10b981] border-2 border-white shadow-xs"></span>
      </button>
    </div>
  );
}
