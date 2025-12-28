import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";

// ============ Error Logging ============
interface ApiErrorLog {
	timestamp: string;
	method?: string;
	url?: string;
	status?: number;
	statusText?: string;
	message: string;
	data?: unknown;
}

const logError = (error: AxiosError): void => {
	// Skip logging in SSR/Worker to avoid console noise
	if (typeof window === "undefined") return;

	const errorLog: ApiErrorLog = {
		timestamp: new Date().toISOString(),
		method: error.config?.method?.toUpperCase(),
		url: error.config?.url,
		status: error.response?.status,
		statusText: error.response?.statusText,
		message: error.message,
		data: error.response?.data,
	};

	console.group(`🔴 API Error: ${errorLog.method} ${errorLog.url}`);
	console.error("Status:", errorLog.status, errorLog.statusText);
	console.error("Message:", errorLog.message);
	if (errorLog.data) {
		console.error("Response:", errorLog.data);
	}
	console.error("Timestamp:", errorLog.timestamp);
	console.groupEnd();
};

const logRequest = (config: InternalAxiosRequestConfig): void => {
	if (typeof window === "undefined") return;

	console.log(`🔵 API Request: ${config.method?.toUpperCase()} ${config.url}`);
};

const logResponse = (response: AxiosResponse): void => {
	if (typeof window === "undefined") return;

	console.log(
		`🟢 API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`
	);
};

// ============ Storage Helpers ============
// Helper to safely access localStorage (only in browser)
const getStorageItem = (key: string): string | null => {
	if (typeof window === "undefined") return null;
	return localStorage.getItem(key);
};

const setStorageItem = (key: string, value: string): void => {
	if (typeof window !== "undefined") {
		localStorage.setItem(key, value);
	}
};

const removeStorageItem = (key: string): void => {
	if (typeof window !== "undefined") {
		localStorage.removeItem(key);
	}
};

// Create axios instance with default config
export const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001",
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

// Track if we're currently refreshing the token
let isRefreshing = false;
let failedQueue: Array<{
	resolve: (value?: unknown) => void;
	reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null) => {
	failedQueue.forEach((prom) => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve();
		}
	});
	failedQueue = [];
};

// Request interceptor - add Authorization header (browser only)
api.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		const accessToken = getStorageItem("accessToken");

		if (accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`;
		}

		logRequest(config);
		return config;
	},
	(error) => {
		console.log(error);
		logError(error);
		return Promise.reject(error);
	}
);

// Response interceptor - handle 401 and token refresh
api.interceptors.response.use(
	(response) => {
		logResponse(response);
		return response;
	},
	async (error: AxiosError) => {
		const originalRequest = error.config as InternalAxiosRequestConfig & {
			_retry?: boolean;
		};

		// Log error (skip 401 that will be retried)
		if (error.response?.status !== 401 || originalRequest._retry) {
			logError(error);
		}

		// Skip token refresh logic if not in browser environment (SSR/Worker)
		if (typeof window === "undefined") {
			return Promise.reject(error);
		}

		// If error is 401 and we haven't already tried to refresh
		if (error.response?.status === 401 && !originalRequest._retry) {
			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				}).then(() => api(originalRequest));
			}

			originalRequest._retry = true;
			isRefreshing = true;

			try {
				const refreshToken = getStorageItem("refreshToken");

				if (!refreshToken) {
					throw new Error("No refresh token available");
				}

				console.log("🔄 Refreshing access token...");
				const response = await api.post("/api/users/refresh-token", { refreshToken });

				if (response.data?.accessToken) {
					setStorageItem("accessToken", response.data.accessToken);
					console.log("✅ Token refreshed successfully");
				}

				processQueue(null);
				return api(originalRequest);
			} catch (refreshError) {
				console.error("❌ Token refresh failed");
				logError(refreshError as AxiosError);
				processQueue(refreshError as AxiosError);
				removeStorageItem("accessToken");
				removeStorageItem("refreshToken");
				window.location.href = "/";
				return Promise.reject(refreshError);
			} finally {
				isRefreshing = false;
			}
		}

		return Promise.reject(error);
	}
);

export default api;
