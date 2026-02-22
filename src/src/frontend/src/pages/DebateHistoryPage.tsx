import { useState, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Filter, Calendar } from "lucide-react";
import { useAuth } from "../App";
import type { Debate } from "../backend";

export default function DebateHistoryPage() {
  const navigate = useNavigate();
  const { isAuthenticated, userProfile } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedDebate, setSelectedDebate] = useState<Debate | null>(null);

  const debates = userProfile?.debateHistory || [];
  const categories = Array.from(new Set(debates.map((d) => d.category))).filter(Boolean);

  const filteredDebates = useMemo(() => {
    return debates.filter((debate) => {
      const matchesSearch = debate.topic
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || debate.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [debates, searchQuery, categoryFilter]);

  if (!isAuthenticated || !userProfile) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-display font-bold mb-4">Login Required</h2>
        <p className="text-muted-foreground mb-6">
          Please login to view your debate history
        </p>
        <Button onClick={() => navigate({ to: "/" })}>Go Home</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold mb-2">
          Debate <span className="text-gradient-cyan">History</span>
        </h1>
        <p className="text-muted-foreground">Review your past debates</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search debates..."
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredDebates.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              {searchQuery || categoryFilter !== "all"
                ? "No debates match your filters"
                : "No debates yet"}
            </p>
            <Button onClick={() => navigate({ to: "/" })}>Start Debating</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredDebates.map((debate, index) => (
            <Card
              key={index}
              className="cursor-pointer hover:border-accent/50 transition-colors"
              onClick={() => setSelectedDebate(debate)}
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-display font-semibold text-lg truncate">
                        {debate.topic}
                      </h3>
                      <Badge variant="outline" className="shrink-0">
                        {debate.category}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(Number(debate.turns[0]?.timestamp || 0)).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>{debate.mode}</span>
                      <span>•</span>
                      <span>
                        You: <strong>{debate.userSide.display}</strong>
                      </span>
                      <span>•</span>
                      <span>{debate.turns.length} exchanges</span>
                    </div>
                  </div>
                  <div className="text-center shrink-0">
                    <div className="text-3xl font-display font-bold text-accent">
                      {debate.score.overall}
                    </div>
                    <Badge variant="secondary" className="mt-1">
                      {debate.result.overallRating}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedDebate && (
        <Dialog open={!!selectedDebate} onOpenChange={() => setSelectedDebate(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">
                {selectedDebate.topic}
              </DialogTitle>
              <div className="flex items-center gap-3 text-sm text-muted-foreground pt-2">
                <Badge>{selectedDebate.category}</Badge>
                <span>•</span>
                <span>{selectedDebate.mode}</span>
                <span>•</span>
                <span>Score: {selectedDebate.score.overall}</span>
              </div>
            </DialogHeader>

            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {selectedDebate.turns.map((turn, index) => {
                  const isUser = index % 2 === 1;
                  return (
                    <div
                      key={index}
                      className={isUser ? "text-right" : "text-left"}
                    >
                      <div
                        className={`inline-block max-w-[80%] p-4 rounded-lg ${
                          isUser
                            ? "bg-primary text-primary-foreground"
                            : "bg-accent/10 border border-accent/50"
                        }`}
                      >
                        <div className="text-xs font-medium mb-2 opacity-70">
                          {isUser ? "You" : "AI"}
                        </div>
                        <div
                          className="text-sm"
                          dangerouslySetInnerHTML={{
                            __html: turn.content.replace(
                              /\*\*(.*?)\*\*/g,
                              '<strong class="font-bold">$1</strong>'
                            ),
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            {selectedDebate.tips.length > 0 && (
              <div className="border-t pt-4 mt-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  💡 Tips for Improvement
                </h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {selectedDebate.tips.map((tip, i) => (
                    <li key={i}>• {tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
