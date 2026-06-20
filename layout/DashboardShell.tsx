"use client";
import { ReactNode } from "react";
import { AppData } from "@/lib/types";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";

type Tab = "today" | "stats" | "reflect" | "history";

interface Props {
  data: AppData;
  userName?: string;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  children: ReactNode;
}

export default function DashboardShell({
  data,
  userName,
  activeTab,
  onTabChange,
  children,
}: Props) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar
        data={data}
        userName={userName}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />

      <main className="flex-1 min-w-0 pb-20 lg:pb-0">
        <div className="max-w-5xl mx-auto px-4 py-6 md:px-6 md:py-8">{children}</div>
      </main>

      <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
}
