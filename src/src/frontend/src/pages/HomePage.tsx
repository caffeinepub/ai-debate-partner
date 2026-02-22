import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, TrendingUp, Brain, Target, BookOpen } from "lucide-react";
import { useAuth } from "../App";
import { useGetCallerUserRole } from "../hooks/useQueries";

const CATEGORIES = [
  "Politics",
  "Technology",
  "Education",
  "Ethics",
  "Business",
  "Entertainment",
  "Custom",
];

const MODES = [
  {
    id: "Casual",
    title: "Casual",
    description: "Relaxed practice with friendly tone",
    icon: Brain,
  },
  {
    id: "Competitive",
    title: "Competitive",
    description: "Challenging arguments and deeper analysis",
    icon: Target,
  },
  {
    id: "Exam Preparation",
    title: "Exam Prep",
    description: "Timed debates with structured format",
    icon: BookOpen,
  },
];

const RESPONSE_LENGTHS = [
  { id: "Short", label: "Short", description: "Quick responses" },
  { id: "Medium", label: "Medium", description: "Balanced depth" },
  { id: "Detailed", label: "Detailed", description: "Comprehensive arguments" },
];

const TRENDING_TOPICS = [
  "Social media regulation",
  "Remote work vs office",
  "Universal basic income",
  "AI in education",
  "Climate change solutions",
  "Space exploration funding",
];

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated, userProfile } = useAuth();
  const { data: userRole } = useGetCallerUserRole();

  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState("Technology");
  const [mode, setMode] = useState("Casual");
  const [responseLength, setResponseLength] = useState("Medium");

  const isGuest = userRole === "guest";
  const debatesCount = userProfile?.debateHistory.length || 0;
  const guestLimit = 5;
  const guestDebatesRemaining = isGuest ? Math.max(0, guestLimit - debatesCount) : null;

  const handleStartDebate = () => {
    if (!topic.trim()) {
      return;
    }

    if (isGuest && debatesCount >= guestLimit) {
      return;
    }

    navigate({
      to: "/side-selection",
      search: { topic, category, mode, responseLength },
    });
  };

  const selectTrendingTopic = (trendingTopic: string) => {
    setTopic(trendingTopic);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Hero Section */}
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
          Practice Debating with <span className="text-gradient-cyan">AI</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Sharpen your argumentation skills. Challenge an AI opponent on any topic.
        </p>
      </div>

      {/* Guest Warning */}
      {isGuest && guestDebatesRemaining !== null && (
        <Card className="mb-8 border-accent/50 bg-accent/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-accent mt-0.5" />
              <div>
                <p className="text-sm font-medium">Guest Mode</p>
                <p className="text-sm text-muted-foreground">
                  You have {guestDebatesRemaining} debate{guestDebatesRemaining !== 1 ? "s" : ""}{" "}
                  remaining. Login to unlock unlimited debates!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Configuration */}
      <div className="space-y-8">
        {/* Topic Input */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Debate Topic</label>
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter any topic you want to debate..."
            className="text-lg py-6"
          />
        </div>

        {/* Trending Topics */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-accent" />
            <label className="text-sm font-medium">Trending Topics</label>
          </div>
          <div className="flex flex-wrap gap-2">
            {TRENDING_TOPICS.map((trendingTopic) => (
              <Badge
                key={trendingTopic}
                variant="outline"
                className="cursor-pointer hover:bg-accent/10 hover:border-accent transition-colors"
                onClick={() => selectTrendingTopic(trendingTopic)}
              >
                {trendingTopic}
              </Badge>
            ))}
          </div>
        </div>

        {/* Category Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Category</label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Debate Mode */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Debate Mode</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {MODES.map((m) => {
              const Icon = m.icon;
              return (
                <Card
                  key={m.id}
                  className={`cursor-pointer transition-all hover:border-accent ${
                    mode === m.id ? "border-accent bg-accent/5" : ""
                  }`}
                  onClick={() => setMode(m.id)}
                >
                  <CardContent className="pt-6">
                    <Icon
                      className={`w-6 h-6 mb-2 ${
                        mode === m.id ? "text-accent" : "text-muted-foreground"
                      }`}
                    />
                    <h3 className="font-semibold mb-1">{m.title}</h3>
                    <p className="text-xs text-muted-foreground">{m.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Response Length */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Response Length</label>
          <div className="grid grid-cols-3 gap-3">
            {RESPONSE_LENGTHS.map((length) => (
              <Button
                key={length.id}
                variant={responseLength === length.id ? "default" : "outline"}
                onClick={() => setResponseLength(length.id)}
                className="flex flex-col h-auto py-3"
              >
                <span className="font-semibold">{length.label}</span>
                <span className="text-xs opacity-80">{length.description}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <Button
          onClick={handleStartDebate}
          disabled={!topic.trim() || (isGuest && debatesCount >= guestLimit)}
          size="lg"
          className="w-full text-lg py-6 glow-accent"
        >
          Start Debate
        </Button>
      </div>
    </div>
  );
}
