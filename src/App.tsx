import { useEffect } from "react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@/lib/theme";
import { ensureExamples } from "@/lib/db";
import { Navbar } from "@/components/Navbar";
import { Landing } from "@/pages/Landing";
import { Demo } from "@/pages/Demo";
import { Dashboard } from "@/pages/Dashboard";
import { Interview } from "@/pages/Interview";
import { SessionRun } from "@/pages/SessionRun";

function Layout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default function App() {
  useEffect(() => {
    ensureExamples();
  }, []);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route element={<Layout />}>
            <Route path="/demo" element={<Demo />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route path="/interview/:id" element={<Interview />} />
          <Route path="/session/:id" element={<SessionRun />} />
          <Route path="*" element={<Landing />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
