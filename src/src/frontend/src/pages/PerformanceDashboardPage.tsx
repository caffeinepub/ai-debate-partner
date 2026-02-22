import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { useGetCallerUserProfile } from "../hooks/useQueries";
import { Trophy, TrendingUp, Award, Target, Plus } from "lucide-react";
import { useAuth } from "../App";

export default function PerformanceDashboardPage() {
  const navigate = useNavigate();
  const { isAuthenticated, userProfile } = useAuth();

  if (!isAuthenticated || !userProfile) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-display font-bold mb-4">Login Required</h2>
        <p className="text-muted-foreground mb-6">
          Please login to view your performance dashboard
        </p>
        <Button onClick={() => navigate({ to: "/" })}>Go Home</Button>
      </div>
    );
  }

  const stats = userProfile.stats;
  const recentDebates = userProfile.debateHistory.slice(-5).reverse();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2">
            Performance <span className="text-gradient-cyan">Dashboard</span>
          </h1>
          <p className="text-muted-foreground">Track your debate progress</p>
        </div>
        <Button onClick={() => navigate({ to: "/" })} className="gap-2">
          <Plus className="w-4 h-4" />
          New Debate
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold">
                  {stats.totalDebates.toString()}
                </p>
                <p className="text-sm text-muted-foreground">Total Debates</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/10 to-transparent border-accent/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold">
                  {Math.round(stats.winRate)}%
                </p>
                <p className="text-sm text-muted-foreground">Win Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-chart-4/10 to-transparent border-chart-4/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-chart-4/20 flex items-center justify-center">
                <Award className="w-6 h-6 text-chart-4" />
              </div>
              <div>
                <p className="text-lg font-display font-bold truncate">
                  {stats.strongestCategory || "N/A"}
                </p>
                <p className="text-sm text-muted-foreground">Strongest Category</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-destructive/10 to-transparent border-destructive/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-lg font-display font-bold truncate">
                  {stats.weakestCategory || "N/A"}
                </p>
                <p className="text-sm text-muted-foreground">Weakest Category</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Debates */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display">Recent Debates</CardTitle>
        </CardHeader>
        <CardContent>
          {recentDebates.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No debates yet</p>
              <Button onClick={() => navigate({ to: "/" })}>Start Your First Debate</Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentDebates.map((debate, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-card/50 border border-border hover:border-accent/50 transition-colors cursor-pointer"
                  onClick={() => navigate({ to: "/history" })}
                >
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{debate.topic}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{debate.category}</span>
                      <span>•</span>
                      <span>{debate.mode}</span>
                      <span>•</span>
                      <span>You: {debate.userSide.display}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-display font-bold text-accent">
                      {debate.score.overall}
                    </div>
                    <div className="text-xs text-muted-foreground">Score</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
