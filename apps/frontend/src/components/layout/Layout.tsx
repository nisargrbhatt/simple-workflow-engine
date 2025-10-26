import { cn } from "@/lib/utils";
import { ModeToggle } from "../helpers/mode-toggle";
import { WorkflowIcon } from "lucide-react";
import ContextFactory from "@/contexts/ContextFactory";
import { Button } from "../ui/button";
import type { FC, ReactNode } from "react";
import { Link } from "@tanstack/react-router";

interface Props {
	children: ReactNode;
}

const Layout: FC<Props> = ({ children }) => (
	<ContextFactory>
		<div className={cn("flex min-h-screen flex-col bg-background")}>
			<header className="border-b">
				<div className="container mx-auto flex h-16 items-center justify-between px-4">
					<Link to="/" className="text-xl font-bold">
						<WorkflowIcon />
					</Link>
					<nav className="flex flex-row items-center justify-center gap-2">
						<Link
							to="/definitions"
							className="text-sm text-muted-foreground transition-colors hover:text-foreground"
						>
							<Button variant="ghost" size="sm" type="button">
								Definitions
							</Button>
						</Link>
					</nav>
				</div>
			</header>
			<main className="container mx-auto flex-1 px-4 py-2">{children}</main>
			<footer className="border-t py-6">
				<div className="container mx-auto flex items-center justify-between px-4">
					<ModeToggle />
					<p className="text-sm text-muted-foreground">
						Built by{" "}
						<a href="https://nisargbhatt.org" target="_blank" className="link">
							Nisarg
						</a>{" "}
						for everyone
					</p>
				</div>
			</footer>
		</div>
	</ContextFactory>
);

export default Layout;
