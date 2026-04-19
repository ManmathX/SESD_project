const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

class ApiService {
    private token: string | null = null;

    constructor() {
        this.token = localStorage.getItem('token');
    }

    setToken(token: string) {
        this.token = token;
        localStorage.setItem('token', token);
    }

    clearToken() {
        this.token = null;
        localStorage.removeItem('token');
    }

    private async request(endpoint: string, options: RequestInit = {}) {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers: { ...headers, ...options.headers as Record<string, string> },
        });

        const textText = await response.text();
        
        let data;
        try {
            data = JSON.parse(textText);
        } catch (e) {
            if (textText.trim().startsWith('<')) {
                throw new Error("API returned an HTML page. Please verify that your VITE_API_BASE_URL endpoint is correctly configured in your deployment settings.");
            }
            throw new Error("Invalid format received from API.");
        }

        if (!response.ok) throw new Error(data.error || 'Request failed');
        return data;
    }

    async register(name: string, email: string, password: string) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password }),
        });
    }

    async login(email: string, password: string) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    }

    async getProducts() {
        return this.request('/products');
    }

    async createProduct(data: { name: string; price: number; description: string; stock: number; category: string }) {
        return this.request('/products', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async placeOrder(items: { productId: string; name: string; price: number; quantity: number }[]) {
        return this.request('/orders', {
            method: 'POST',
            body: JSON.stringify({ items }),
        });
    }

    async getMyOrders() {
        return this.request('/orders/my-orders');
    }
}

export const apiService = new ApiService();
