import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@lib/queryClient";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import "./index.css";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const router = createRouter({
	routeTree,
	context: { auth: undefined },
	defaultPreload: "intent",
	defaultPreloadStaleTime: 0,
	defaultStructuralSharing: true,
	scrollRestoration: true,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
	throw new Error("Add your Clerk Publishable Key to the .env file");
}

function App() {
	const auth = useAuth();

	return <RouterProvider router={router} context={{ auth }} />;
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<ClerkProvider publishableKey={PUBLISHABLE_KEY}>
				<QueryClientProvider client={queryClient}>
					<App />
				</QueryClientProvider>
			</ClerkProvider>
		</StrictMode>
	);
}
