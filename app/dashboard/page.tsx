import { DeveloperDashboard } from "@/components/developer-dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Developer Dashboard | Nemo",
  description: "A personal productivity dashboard with pomodoro timer, task tracking, and coding stats",
};

export default function DashboardPage() {
  return <DeveloperDashboard />;
}
