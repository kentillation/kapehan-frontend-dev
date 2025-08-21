import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import apiClient from '@/axios';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
    const router = useRouter();

    // State
    const token = ref(localStorage.getItem('auth_token') || null);
    const error = ref(null);

    // Getters
    const isAuthenticated = computed(() => !!token.value);

    // Actions
    const login = async (credentials) => {
        error.value = null;
        try {
            const response = await apiClient.post('/dev/login', credentials);
            if (response.status === 200) {
                token.value = response.data.access_token;
                localStorage.setItem('auth_token', token.value);
                return true;
            }
        } catch (err) {
            error.value = err.response?.data?.message ||
                err.message ||
                'Login failed. Please try again.';
            throw error.value;
        }
    };

    const logout = async () => {
        const currentToken = token.value;
        token.value = null;
        error.value = null;
        localStorage.removeItem('auth_token', token.value);
        // localStorage.clear();
        try {
            if (currentToken) {
                await apiClient.post('/logout', null, {
                    headers: {
                        Authorization: `Bearer ${currentToken}`
                    },
                    timeout: 1000
                });
            }
        } catch (err) {
            console.error('Logout API error:', err);
        }
        window.location.href = '/';
    };

    const checkAuth = () => {
        if (!isAuthenticated.value && router.currentRoute.value.meta.requiresAuth) {
            logout();
        }
    };

    return {
        token,
        isAuthenticated,
        error,
        login,
        logout,
        checkAuth,
    };
});