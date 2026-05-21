import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
const API_BASE_URL = process.env.API_BASE_URL || 'https://api.example.com';
const API_TIMEOUT = parseInt(process.env.API_TIMEOUT || '30000', 10);
class ApiClient {
    private client: AxiosInstance;
    constructor() {
        this.client = axios.create({
            baseURL: API_BASE_URL,
            timeout: API_TIMEOUT,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        this.setupInterceptors();
    }
    private setupInterceptors(): void {
        this.client.interceptors.request.use(async (config) => {
            try {
                const { getSecureItem, SECURE_KEYS } = await import('./secure-storage-adapter');
                const token = await getSecureItem(SECURE_KEYS.AUTH_TOKEN);
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }
            catch {
            }
            return config;
        }, (error: AxiosError) => {
            return Promise.reject(error);
        });
        this.client.interceptors.response.use((response: AxiosResponse) => {
            return response;
        }, (error: AxiosError) => {
            if (error.response) {
                switch (error.response.status) {
                    case 401:
                        break;
                    case 403:
                        break;
                    case 404:
                        break;
                    case 500:
                        break;
                    default:
                        break;
                }
            }
            return Promise.reject(error);
        });
    }
    public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.client.get<T>(url, config);
    }
    public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.client.post<T>(url, data, config);
    }
    public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.client.put<T>(url, data, config);
    }
    public patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.client.patch<T>(url, data, config);
    }
    public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.client.delete<T>(url, config);
    }
    public getInstance(): AxiosInstance {
        return this.client;
    }
}
export const apiClient = new ApiClient();
export default apiClient;
