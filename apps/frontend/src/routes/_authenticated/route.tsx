import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import type { useAuth } from "@clerk/clerk-react";

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: async (ctx) => {
		const token = await (ctx.context as { auth: ReturnType<typeof useAuth> }).auth.getToken();
		if (!token) {
			throw redirect({ to: "/sign-in", search: { redirectTo: ctx.location.pathname } });
		}
		if (token) {
			localStorage.setItem("token", token);
		}
	},
	component: () => <Outlet />,
});
