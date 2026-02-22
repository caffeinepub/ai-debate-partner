import { useEffect, useState } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Home, RefreshCw, Share2, Download, Lightbulb } from "lucide-react";
import { useAddToDebateHistory } from "../hooks/useQueries";
import { toast } from "sonner";
import type { Debate } from "../backend";

interface DebateData {
  config: {
    topic: string;
    category: string;
    mode: string;
    responseLength: string;
    userSide: string;
    aiSide: string;
  };
  messages: Array<{
    role: string;
    content: string;
    timestamp: bigint;
  }>;
  duration: number;
}

interface Scores {
  logical: number;
  confidence: number;
  clarity: number;
  overall: number;
}

export default function PostDebateScorePage() {
  const navigate = useNavigate();
  const { debateId } = useParams({ from: "/score/$debateId" });
  const [debateData, setDebateData] = useState<DebateData | null>(null);
  const [scores, setScores] = useState<Scores | null>(null);
  const [tips, setTips] = useState<string[]>([]);
  const [overallRating, setOverallRating] = useState("");
  const { mutate: addToHistory } = useAddToDebateHistory();

  useEffect(() => {
    const stored = sessionStorage.getItem(`${debateId}-complete`);
    if (stored) {
      const data = JSON.parse(stored);
      setDebateData(data);

      // Calculate scores based on debate performance
      const calculatedScores = calculateScores(data);
      setScores(calculatedScores);

      const generatedTips = generateTips(calculatedScores);
      setTips(generatedTips);

      const rating = getRating(calculatedScores.overall);
      setOverallRating(rating);

      // Save to backend
      saveDebateToHistory(data, calculatedScores, generatedTips, rating);
    } else {
      navigate({ to: "/" });
    }
  }, [debateId]);

  const calculateScores = (data: DebateData): Scores => {
    // Simple scoring algorithm based on message count and length
    const userMessages = data.messages.filter((m) => m.role === "user");
    const avgLength = userMessages.reduce((acc, m) => acc + m.content.length, 0) / userMessages.length;

    const logical = Math.min(100, 60 + userMessages.length * 5 + Math.floor(avgLength / 20));
    const confidence = Math.min(100, 50 + userMessages.length * 6 + Math.floor(avgLength / 15));
    const clarity = Math.min(100, 55 + userMessages.length * 7 + Math.floor(avgLength / 25));
    const overall = Math.floor((logical + confidence + clarity) / 3);

    return { logical, confidence, clarity, overall };
  };

  const generateTips = (scores: Scores): string[] => {
    const tips: string[] = [];

    if (scores.logical < 70) {
      tips.push("Structure your arguments with clear premises and conclusions");
      tips.push("Support your claims with specific examples or evidence");
    }

    if (scores.confidence < 70) {
      tips.push("Use stronger, more assertive language");
      tips.push("Avoid hedging words like 'maybe', 'perhaps', or 'I think'");
    }

    if (scores.clarity < 70) {
      tips.push("Break down complex ideas into simpler points");
      tips.push("Use transition words to connect your arguments");
    }

    if (tips.length === 0) {
      tips.push("Excellent work! Continue practicing with more challenging topics");
      tips.push("Try the Competitive mode for deeper analysis");
    }

    return tips;
  };

  const getRating = (score: number): string => {
    if (score >= 90) return "Excellent";
    if (score >= 75) return "Strong";
    if (score >= 60) return "Good";
    if (score >= 45) return "Fair";
    return "Needs Improvement";
  };

  const saveDebateToHistory = (
    data: DebateData,
    scores: Scores,
    tips: string[],
    rating: string
  ) => {
    const debate: Debate = {
      topic: data.config.topic,
      category: data.config.category,
      mode: data.config.mode,
      responseLength: data.config.responseLength,
      userSide: { name: data.config.userSide, display: data.config.userSide },
      aiSide: { name: data.config.aiSide, display: data.config.aiSide },
      turns: data.messages.map((m) => ({
        content: m.content,
        timestamp: m.timestamp,
      })),
      score: {
        overall: scores.overall,
        calculatedOnDfinity: scores.overall,
        calculatedOnOpenAi: 0,
      },
      result: {
        overallRating: rating,
      },
      tips,
      status: { name: "completed", display: "Completed" },
    };

    addToHistory(debate, {
      onError: (error) => {
        console.error("Failed to save debate:", error);
      },
    });
  };

  const handleShare = () => {
    if (scores) {
      const text = `I just completed a debate on "${debateData?.config.topic}" and scored ${scores.overall}/100! 🎯`;
      if (navigator.share) {
        navigator.share({ text });
      } else {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
      }
    }
  };

  const handleExportPDF = () => {
    toast.info("PDF export coming soon!");
  };

  if (!debateData || !scores) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">
          Debate Complete!
        </h1>
        <p className="text-muted-foreground">{debateData.config.topic}</p>
      </div>

      {/* Overall Score */}
      <Card className="mb-8 border-accent/50 bg-gradient-to-br from-accent/5 to-transparent">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="text-6xl font-display font-bold text-gradient-cyan mb-2">
            {scores.overall}
          </div>
          <Badge variant="outline" className="text-lg px-4 py-1">
            {overallRating}
          </Badge>
        </CardContent>
      </Card>

      {/* Score Breakdown */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="font-display">Performance Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Logical Strength</span>
              <span className="text-sm text-muted-foreground">{scores.logical}/100</span>
            </div>
            <Progress value={scores.logical} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Confidence Score</span>
              <span className="text-sm text-muted-foreground">{scores.confidence}/100</span>
            </div>
            <Progress value={scores.confidence} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Clarity Score</span>
              <span className="text-sm text-muted-foreground">{scores.clarity}/100</span>
            </div>
            <Progress value={scores.clarity} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Improvement Tips */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-accent" />
            Improvement Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <span className="text-accent mt-1">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Button variant="outline" onClick={handleShare} className="gap-2">
          <Share2 className="w-4 h-4" />
          Share
        </Button>
        <Button variant="outline" onClick={handleExportPDF} className="gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate({ to: "/" })}
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          New Debate
        </Button>
        <Button
          onClick={() => navigate({ to: "/dashboard" })}
          className="gap-2"
        >
          <Home className="w-4 h-4" />
          Dashboard
        </Button>
      </div>
    </div>
  );
}
