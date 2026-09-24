"use client";

import React, { useState } from "react";
import { api } from "@/lib/api";
import { generateCopilotResponse } from "@/lib/copilotEngine";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  ShieldAlert,
  Building2,
  Receipt,
  Search,
  Minimize2,
  Maximize2
} from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "copilot";
  text: string;
  timestamp: string;
  metadata?: {
    entities?: string[];
    suggestedActions?: string[];
  };
}

export function AICopilotDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m-1",
      sender: "copilot",
      text: "Tactical Copilot online. Ask me about suspect risk scores, shell companies, nominee directors, or financial laundering trails.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      metadata: {
        suggestedActions: [
          "Who controls Zenith Horizon Mercantile?",
          "List all mules under Vikramaditya Singhania",
          "What is the total value of seized PMLA assets?"
        ]
      }
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  async function handleSend(textToSend?: string) {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery("");
    setIsTyping(true);

    try {
      // Call live backend Tactical Copilot API
      const res = await api.queryCopilot(query);
      
      let replyText = res?.answer_markdown || res?.answer || "";
      let suggested = res?.suggested_queries || res?.metadata?.suggestedActions || [];
      let entities: string[] = res?.metadata?.entities || [];

      if (!replyText || replyText.includes("recorded in offline demonstration buffer")) {
        const engineRes = generateCopilotResponse(query);
        replyText = engineRes.answer;
        if (suggested.length === 0) suggested = engineRes.suggested_queries;
        if (entities.length === 0) entities = engineRes.entities;
      }

      if (res?.suspect) {
        entities.push(res.suspect);
      }
      if (res?.evidence_items && Array.isArray(res.evidence_items)) {
        res.evidence_items.forEach((item: any) => {
          if (item?.feature_name) entities.push(item.feature_name);
          if (item?.location) entities.push(item.location);
          if (item?.suspect_name) entities.push(item.suspect_name);
        });
      }

      const copilotMsg: Message = {
        id: `c-${Date.now()}`,
        sender: "copilot",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        metadata: {
          entities: entities.length > 0 ? Array.from(new Set(entities)).slice(0, 4) : undefined,
          suggestedActions: suggested.length > 0 ? suggested.slice(0, 3) : undefined
        }
      };

      setMessages((prev) => [...prev, copilotMsg]);
    } catch (err: any) {
      const engineRes = generateCopilotResponse(query);
      const copilotMsg: Message = {
        id: `c-${Date.now()}`,
        sender: "copilot",
        text: engineRes.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        metadata: {
          entities: engineRes.entities,
          suggestedActions: engineRes.suggested_queries.slice(0, 3)
        }
      };

      setMessages((prev) => [...prev, copilotMsg]);
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 font-sans">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[var(--surface)] hover:bg-[var(--surface-2)] text-[var(--text)] rounded-full px-4 py-3 shadow-2xl flex items-center gap-2 border border-[var(--border)] hover:border-blue-500 backdrop-blur-md transition-all text-xs font-medium"
        >
          <Sparkles className="w-4 h-4 text-blue-500 animate-pulse" />
          <span>AI Copilot</span>
        </button>
      )}

      {isOpen && (
        <Card className="w-[calc(100vw-2rem)] sm:w-[420px] h-[520px] max-h-[85vh] bg-[var(--surface)] border-[var(--border)] text-[var(--text)] shadow-2xl flex flex-col overflow-hidden text-xs rounded-xl font-sans transition-colors">
          {/* Header */}
          <div className="p-3.5 bg-[var(--surface-2)] border-b border-[var(--border)] flex justify-between items-center text-[var(--text)]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-blue-500">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-[var(--text)] flex items-center gap-1.5">
                  Tactical AI Copilot
                  <Badge variant="default" className="text-[9px] py-0 px-1 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    LIVE
                  </Badge>
                </h4>
                <p className="text-[10px] text-[var(--text-muted)]">PMLA & Police Intelligence Reasoning</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)] rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-[var(--bg)]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "copilot" && (
                  <div className="w-6 h-6 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-500 shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-lg max-w-[85%] space-y-1.5 ${
                    m.sender === "user"
                      ? "bg-blue-600 text-white font-medium"
                      : "bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)]"
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-line text-xs">{m.text}</p>
                  {m.metadata?.entities && m.metadata.entities.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1 border-t border-[var(--border)]">
                      {m.metadata.entities.map((e, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded text-[10px] bg-[var(--surface)] text-blue-600 dark:text-blue-400 border border-[var(--border)]"
                        >
                          #{e}
                        </span>
                      ))}
                    </div>
                  )}
                  {m.metadata?.suggestedActions && (
                    <div className="space-y-1 pt-1.5">
                      <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide block font-bold">Suggested:</span>
                      {m.metadata.suggestedActions.map((act, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(act)}
                          className="w-full text-left p-1.5 rounded bg-[var(--surface)] hover:bg-[var(--surface-2)] text-[11px] text-blue-600 dark:text-blue-400 border border-[var(--border)] transition-colors block"
                        >
                          &rsaquo; {act}
                        </button>
                      ))}
                    </div>
                  )}
                  <span className="text-[9px] text-[var(--text-muted)] block text-right">{m.timestamp}</span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2 text-[var(--text-muted)] text-xs items-center pl-2">
                <Sparkles className="w-3.5 h-3.5 animate-spin text-blue-500" />
                <span>Copilot is analyzing financial graphs & FIR intelligence...</span>
              </div>
            )}
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 bg-[var(--surface-2)] border-t border-[var(--border)] flex gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask copilot (e.g. show shell companies)..."
              className="flex-1 bg-[var(--surface)] border border-[var(--border)] rounded-md px-3 py-2 text-xs text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-blue-500"
            />
            <Button
              type="submit"
              disabled={!inputQuery.trim() || isTyping}
              size="sm"
              className="bg-blue-600 hover:bg-blue-500 text-white px-3"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
}
