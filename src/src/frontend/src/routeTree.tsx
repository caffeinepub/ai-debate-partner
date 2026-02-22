import { createRootRoute, createRoute, Outlet } from "@tanstack/react-router";
import HomePage from "./pages/HomePage";
import SideSelectionPage from "./pages/SideSelectionPage";
import DebateChatPage from "./pages/DebateChatPage";
import PostDebateScorePage from "./pages/PostDebateScorePage";
import PerformanceDashboardPage from "./pages/PerformanceDashboardPage";
import DebateHistoryPage from "./pages/DebateHistoryPage";
import RootLayout from "./components/RootLayout";

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const sideSelectionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/side-selection",
  component: SideSelectionPage,
});

const debateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/debate/$debateId",
  component: DebateChatPage,
});

const scoreRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/score/$debateId",
  component: PostDebateScorePage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: PerformanceDashboardPage,
});

const historyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/history",
  component: DebateHistoryPage,
});

export const routeTree = rootRoute.addChildren([
  indexRoute,
  sideSelectionRoute,
  debateRoute,
  scoreRoute,
  dashboardRoute,
  historyRoute,
]);
