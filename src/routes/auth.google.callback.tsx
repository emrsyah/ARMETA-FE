import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

// Define search params schema
type CallbackSearch = {
	accessToken?: string;
	refreshToken?: string;
	error?: string;
	code?: string;
};

export const Route = createFileRoute("/auth/google/callback")({
	validateSearch: (search: Record<string, unknown>): CallbackSearch => {
		console.log("============== OKE ====================");
		console.log(search);
		console.log("============== POKE ====================");
		return {
			accessToken: search.accessToken as string | undefined,
			refreshToken: search.refreshToken as string | undefined,
			code: search.code as string | undefined,
			error: search.error as string | undefined,
		};
	},
	component: AuthCallback,
});

function AuthCallback() {
	const navigate = useNavigate();
	const { accessToken, refreshToken, error, code } = Route.useSearch();

	useEffect(() => {
		const handleCallback = async () => {
			// If there's an error from OAuth
			if (error) {
				console.error("OAuth error:", error);
				navigate({ to: "/", search: { error: "auth_failed" } });
				return;
			}

			// Store refresh token in localStorage for token refresh
			if (refreshToken) {
				localStorage.setItem("refreshToken", refreshToken);
			}

			// Store access token if needed (optional, depends on your auth flow)
			if (accessToken) {
				localStorage.setItem("accessToken", accessToken);
			}

			if (code) {
				localStorage.setItem("code", code);
			}

			// Small delay to ensure everything is set
			await new Promise((resolve) => setTimeout(resolve, 500));

			// Redirect to home/dashboard
			navigate({ to: "/a/home" });
		};

		handleCallback();
	}, [accessToken, refreshToken, error, navigate, code]);

	return (
		<div className="min-h-screen flex flex-col items-center justify-center gap-4">
			<Loader2 className="h-12 w-12 animate-spin text-primary" />
			<p className="text-lg font-medium text-muted-foreground">Sedang memproses login...</p>
		</div>
	);
}
