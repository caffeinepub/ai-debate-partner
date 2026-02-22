import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "./hooks/useQueries";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}

export function useAuth() {
  const { identity, loginStatus, login, clear, isInitializing } =
    useInternetIdentity();
  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";
  const showProfileSetup =
    isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return {
    identity,
    isAuthenticated,
    isLoggingIn,
    isInitializing,
    userProfile,
    showProfileSetup,
    login,
    logout: clear,
  };
}
