import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { Dashboard } from "./pages/Dashboard";
import { MathSection } from "./pages/MathSection";
import { ScienceSection } from "./pages/ScienceSection";
import { EnglishSection } from "./pages/EnglishSection";
import { MathLesson } from "./pages/MathLesson";
import { ScienceLesson } from "./pages/ScienceLesson";
import { EnglishLesson } from "./pages/EnglishLesson";
import { Quiz } from "./pages/Quiz";
import { VideoLearning } from "./pages/VideoLearning";
import { AITeacher } from "./pages/AITeacher";
import { ParentDashboard } from "./pages/ParentDashboard";
import { Challenges } from "./pages/Challenges";
import { AdminPanel } from "./pages/AdminPanel";
import { History } from "./pages/History";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
  {
    path: "/math",
    Component: MathSection,
  },
  {
    path: "/math/:topic",
    Component: MathLesson,
  },
  {
    path: "/science",
    Component: ScienceSection,
  },
  {
    path: "/science/:topic",
    Component: ScienceLesson,
  },
  {
    path: "/english",
    Component: EnglishSection,
  },
  {
    path: "/english/:topic",
    Component: EnglishLesson,
  },
  {
    path: "/quiz/:subject/:topic",
    Component: Quiz,
  },
  {
    path: "/videos/:subject/:topic",
    Component: VideoLearning,
  },
  {
    path: "/ai-teacher",
    Component: AITeacher,
  },
  {
    path: "/parent-dashboard",
    Component: ParentDashboard,
  },
  {
    path: "/challenges",
    Component: Challenges,
  },
  {
    path: "/admin",
    Component: AdminPanel,
  },
  {
    path: "/history",
    Component: History,
  },
]);
