import { createFileRoute } from "@tanstack/react-router";
import { SignIn } from "@clerk/clerk-react";
import z from "zod/v3";

export const Route = createFileRoute("/sign-in/")({
	validateSearch: z.object({
		redirectTo: z.string().default("/"),
	}),
	component: RouteComponent,
});

function RouteComponent() {
	const { redirectTo } = Route.useSearch();

	return (
		<div className="flex h-full w-full items-center justify-center">
			<SignIn fallbackRedirectUrl={redirectTo} />
		</div>
	);
}
