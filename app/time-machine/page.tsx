import { PortfolioTimeMachine } from "@/components/portfolio-time-machine";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Time Machine | Nemo",
  description: "Journey through the evolution of my portfolio - from v1.0 to the latest version",
};

export default function TimeMachinePage() {
  return <PortfolioTimeMachine />;
}
