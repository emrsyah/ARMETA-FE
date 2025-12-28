import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "secret"; // Fallback to 'secret' if not set, but user should set it

export async function verifyAuth(authHeader: string | null) {
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return null;
	}

	const token = authHeader.split(" ")[1];
	try {
		const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
		return payload as { id_user: string; email: string; nama: string };
	} catch (error) {
		console.error("JWT verification failed:", error);
		return null;
	}
}
