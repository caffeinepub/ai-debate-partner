import { Outlet, Link, useLocation } from "@tanstack/react-router";
import { useAuth } from "../App";
import { Button } from "@/components/ui/button";
import { MessageSquare, BarChart3, History, LogIn, LogOut, Heart } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import ProfileSetupModal from "./ProfileSetupModal";

export default function RootLayout() {
  const { isAuthenticated, isLoggingIn, userProfile, showProfileSetup, login, logout } = useAuth();
  const queryClient = useQueryClient();
  const location = useLocation();

  const handleAuth = async () => {
    if (isAuthenticated) {
      await logout();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error("Login error:", error);
        if (error.message === "User is already authenticated") {
          await logout();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-accent" />
            <span className="text-xl font-display font-bold">
              Debate<span className="text-gradient-cyan">AI</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {isAuthenticated && userProfile && (
              <>
                <Link
                  to="/dashboard"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  <BarChart3 className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  to="/history"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  <History className="w-4 h-4" />
                  History
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {isAuthenticated && userProfile && (
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {userProfile.name}
              </span>
            )}
            <Button
              onClick={handleAuth}
              disabled={isLoggingIn}
              variant={isAuthenticated ? "outline" : "default"}
              size="sm"
              className="gap-2"
            >
              {isLoggingIn ? (
                "Loading..."
              ) : isAuthenticated ? (
                <>
                  <LogOut className="w-4 h-4" />
                  Logout
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Login
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border bg-card/30 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026. Built with{" "}
          <Heart className="w-4 h-4 inline text-accent" /> using{" "}
          <a
            href="https://caffeine.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            caffeine.ai
          </a>
        </div>
      </footer>

      {showProfileSetup && <ProfileSetupModal />}
    </div>
  );
}
