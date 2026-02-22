import { useNavigate, useSearch } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, ArrowLeft } from "lucide-react";
import { useState } from "react";

export default function SideSelectionPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/side-selection" });
  const [selectedSide, setSelectedSide] = useState<"Support" | "Oppose" | null>(null);

  const { topic = "", category = "Custom", mode = "Casual", responseLength = "Medium" } = search as any;

  if (!topic) {
    navigate({ to: "/" });
    return null;
  }

  const handleBeginDebate = () => {
    if (!selectedSide) return;

    // Generate a temporary debate ID (in real app, this would come from backend)
    const debateId = `debate-${Date.now()}`;

    // Store debate config in sessionStorage
    sessionStorage.setItem(
      debateId,
      JSON.stringify({
        topic,
        category,
        mode,
        responseLength,
        userSide: selectedSide,
        aiSide: selectedSide === "Support" ? "Oppose" : "Support",
      })
    );

    navigate({ to: "/debate/$debateId", params: { debateId } });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: "/" })}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
          Choose Your Side
        </h1>
        <div className="bg-card border border-border rounded-lg p-6 max-w-2xl mx-auto">
          <p className="text-sm text-muted-foreground mb-2">Topic</p>
          <p className="text-2xl font-display font-semibold">{topic}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Support Side */}
        <Card
          className={`cursor-pointer transition-all hover:scale-105 hover:border-accent ${
            selectedSide === "Support"
              ? "border-accent bg-accent/10 glow-accent"
              : ""
          }`}
          onClick={() => setSelectedSide("Support")}
        >
          <CardContent className="pt-8 pb-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <ThumbsUp className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-display font-bold mb-2">Support</h2>
            <p className="text-muted-foreground mb-4">
              Argue in favor of the topic
            </p>
            {selectedSide === "Support" && (
              <p className="text-sm text-accent">
                AI will argue <strong>against</strong> the topic
              </p>
            )}
          </CardContent>
        </Card>

        {/* Oppose Side */}
        <Card
          className={`cursor-pointer transition-all hover:scale-105 hover:border-accent ${
            selectedSide === "Oppose"
              ? "border-accent bg-accent/10 glow-accent"
              : ""
          }`}
          onClick={() => setSelectedSide("Oppose")}
        >
          <CardContent className="pt-8 pb-8 text-center">
            <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
              <ThumbsDown className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-2xl font-display font-bold mb-2">Oppose</h2>
            <p className="text-muted-foreground mb-4">
              Argue against the topic
            </p>
            {selectedSide === "Oppose" && (
              <p className="text-sm text-accent">
                AI will argue <strong>in favor</strong> of the topic
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Button
        onClick={handleBeginDebate}
        disabled={!selectedSide}
        size="lg"
        className="w-full text-lg py-6 glow-accent"
      >
        Begin Debate
      </Button>
    </div>
  );
}
