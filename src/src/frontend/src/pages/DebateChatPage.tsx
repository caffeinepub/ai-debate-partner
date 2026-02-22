import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, X, Clock } from "lucide-react";
import { toast } from "sonner";
import { useMakeHttpOutcall, useAddToDebateHistory } from "../hooks/useQueries";
import type { Argument, Debate } from "../backend";

interface DebateConfig {
  topic: string;
  category: string;
  mode: string;
  responseLength: string;
  userSide: string;
  aiSide: string;
}

interface Message {
  role: "user" | "ai";
  content: string;
  timestamp: bigint;
}

export default function DebateChatPage() {
  const navigate = useNavigate();
  const { debateId } = useParams({ from: "/debate/$debateId" });
  const [config, setConfig] = useState<DebateConfig | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [timer, setTimer] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { mutateAsync: makeHttpOutcall } = useMakeHttpOutcall();
  const { mutate: addToHistory } = useAddToDebateHistory();

  useEffect(() => {
    const stored = sessionStorage.getItem(debateId);
    if (stored) {
      const parsedConfig = JSON.parse(stored);
      setConfig(parsedConfig);
      
      // AI starts with opening statement
      setTimeout(() => {
        generateAIResponse(
          [],
          parsedConfig,
          `Make a strong opening argument ${parsedConfig.aiSide === "Support" ? "in favor of" : "against"} the topic: "${parsedConfig.topic}"`
        );
      }, 1000);
    } else {
      navigate({ to: "/" });
    }
  }, [debateId]);

  useEffect(() => {
    if (config?.mode === "Exam Preparation") {
      const interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [config]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const generateAIResponse = async (
    history: Message[],
    debateConfig: DebateConfig,
    userMessage?: string
  ) => {
    setIsTyping(true);
    try {
      // Build conversation context
      const conversationContext = history
        .map((m) => `${m.role === "user" ? "User" : "AI"}: ${m.content}`)
        .join("\n");

      const prompt = `You are participating in a debate. 
Topic: ${debateConfig.topic}
Your position: ${debateConfig.aiSide} the topic
Debate mode: ${debateConfig.mode}
Response length: ${debateConfig.responseLength}

Conversation so far:
${conversationContext}

${userMessage ? `User just said: ${userMessage}` : ""}

Provide a ${debateConfig.responseLength.toLowerCase()} counter-argument that ${debateConfig.aiSide === "Support" ? "supports" : "opposes"} the topic. Use bold text (**text**) to emphasize key points.`;

      // Use a free AI API endpoint (in production, this would be a proper backend call)
      // For now, simulate with a template response
      const response = await simulateAIResponse(debateConfig, userMessage || "opening");

      const aiMessage: Message = {
        role: "ai",
        content: response,
        timestamp: BigInt(Date.now()),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI response error:", error);
      toast.error("Failed to generate AI response");
    } finally {
      setIsTyping(false);
    }
  };

  const simulateAIResponse = async (
    debateConfig: DebateConfig,
    userInput: string
  ): Promise<string> => {
    // In a real implementation, this would call the backend HTTP outcall
    // For demo purposes, return template responses
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const position = debateConfig.aiSide;
    const topic = debateConfig.topic;

    if (userInput === "opening") {
      return `I appreciate this opportunity to debate "${topic}". As someone who ${position === "Support" ? "supports" : "opposes"} this proposition, I believe there are **compelling reasons** to consider. First, let's examine the **fundamental principles** at stake here. The evidence strongly suggests that ${position === "Support" ? "implementing" : "rejecting"} this would lead to **significant benefits** for society as a whole.`;
    }

    return `That's an interesting point you've raised. However, I must **respectfully disagree** with your reasoning. The **key issue** here is that you're overlooking several critical factors. Research has consistently shown that ${position === "Support" ? "supporting" : "opposing"} "${topic}" leads to **better outcomes** in the long run. Consider the **practical implications** of what you're suggesting - it simply doesn't hold up under scrutiny.`;
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !config || isTyping) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: BigInt(Date.now()),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    await generateAIResponse([...messages, userMessage], config, input.trim());
  };

  const handleEndDebate = () => {
    if (messages.length < 2) {
      toast.error("Have at least one exchange before ending");
      return;
    }

    // Save debate to session for scoring
    const debateData = {
      config,
      messages,
      duration: timer,
    };
    sessionStorage.setItem(`${debateId}-complete`, JSON.stringify(debateData));

    navigate({ to: "/score/$debateId", params: { debateId } });
  };

  if (!config) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="border-b border-border bg-card/50 px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex-1">
            <h2 className="font-display font-semibold text-lg">{config.topic}</h2>
            <p className="text-sm text-muted-foreground">
              You: {config.userSide} | AI: {config.aiSide}
            </p>
          </div>
          {config.mode === "Exam Preparation" && (
            <div className="flex items-center gap-2 text-sm bg-accent/10 px-3 py-1 rounded-full">
              <Clock className="w-4 h-4" />
              <span className="font-mono">{formatTime(timer)}</span>
            </div>
          )}
          <Button
            variant="destructive"
            size="sm"
            onClick={handleEndDebate}
            className="ml-4"
          >
            <X className="w-4 h-4 mr-2" />
            End Debate
          </Button>
        </div>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 px-4 py-6">
        <div className="container mx-auto max-w-4xl space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              } animate-slide-up`}
            >
              <Card
                className={`max-w-[80%] ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-accent/10 border-accent/50 animate-pulse-glow"
                }`}
              >
                <div className="p-4">
                  <div
                    className="prose prose-invert prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: message.content.replace(
                        /\*\*(.*?)\*\*/g,
                        '<strong class="text-gradient-cyan font-bold">$1</strong>'
                      ),
                    }}
                  />
                </div>
              </Card>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start animate-fade-in">
              <Card className="bg-accent/10 border-accent/50">
                <div className="p-4 flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-accent rounded-full animate-bounce" />
                    <span
                      className="w-2 h-2 bg-accent rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <span
                      className="w-2 h-2 bg-accent rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">AI is thinking...</span>
                </div>
              </Card>
            </div>
          )}

          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border bg-card/50 px-4 py-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type your argument..."
              disabled={isTyping}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isTyping}
              size="icon"
              className="shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
