"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  History,
  LayoutDashboard,
  Library,
  PlusCircle,
  Sparkles,
} from "lucide-react";

type Item = {
  label: string;
  icon: typeof LayoutDashboard;
  to?: string;
  scrollTo?: string;
};

const ITEMS: Item[] = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  { label: "Nueva simulación", icon: PlusCircle, to: "/demo" },
  { label: "Bancos", icon: Library, scrollTo: "bancos" },
  { label: "Historial", icon: History, scrollTo: "historial" },
];

export function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handle = (item: Item) => {
    if (item.to) {
      navigate(item.to);
    } else if (item.scrollTo) {
      if (pathname !== "/dashboard") navigate("/dashboard");
      requestAnimationFrame(() => {
        document
          .getElementById(item.scrollTo!)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  };

  return (
    <aside className="fixed left-0 top-16 z-30 hidden h-[calc(100vh-4rem)] w-60 flex-col gap-2 border-r border-slate-800 bg-slate-900/40 p-4 backdrop-blur lg:flex">
      <div className="mb-4 flex items-center gap-2 px-2 text-sm font-semibold text-slate-100">
        <Sparkles className="size-5 text-cyan-400" />
        EchoSim
      </div>
      <nav className="flex flex-col gap-1">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const active =
            item.to != null && pathname === item.to;
          return (
            <button
              key={item.label}
              onClick={() => handle(item)}
              className={cn(
                "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "text-cyan-400"
                  : "text-slate-500 hover:text-slate-100",
              )}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-lg bg-slate-800/70"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon className="relative z-10 size-5" />
              <span className="relative z-10">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
