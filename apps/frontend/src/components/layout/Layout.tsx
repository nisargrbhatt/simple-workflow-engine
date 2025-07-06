import { cn } from "@/lib/utils";
import { Link, Outlet } from "react-router";
import { ModeToggle } from "../helpers/mode-toggle";
import { WorkflowIcon } from "lucide-react";
import ContextFactory from "@/contexts/ContextFactory";

export function Layout() {
  return (
    <ContextFactory>
      <div className={cn("bg-background flex min-h-screen flex-col")}>
        <header className="border-b">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <Link to="/" className="text-xl font-bold">
              <WorkflowIcon />
            </Link>
            <nav className="flex flex-row items-center justify-center gap-2">
              <Link to="/definitions" className="text-muted-foreground hover:text-foreground transition-colors">
                Definitions
              </Link>
              <ModeToggle />
            </nav>
          </div>
        </header>
        <main className="container mx-auto flex-1 px-4 py-2">
          <Outlet />
        </main>
        <footer className="border-t py-6">
          <div className="container mx-auto flex items-center justify-between px-4">
            <Link to="/docs" className="text-muted-foreground hover:text-foreground transition-colors">
              Documentation
            </Link>
            <p className="text-muted-foreground text-sm">
              Built by{" "}
              <a href="https://nisargbhatt.org" target="_blank">
                Nisarg
              </a>{" "}
              for everyone
            </p>
          </div>
        </footer>
      </div>
    </ContextFactory>
  );
}
