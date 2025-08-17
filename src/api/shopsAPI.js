import apiClient from '../axios';

export const SHOPS_API = {
    ENDPOINTS: {
        FETCH_ALL_SHOPS: '/dev/shops',
    },

    async fetchStoresApi() {
        try {
            const authToken = localStorage.getItem('auth_token');
            if (!authToken) {
                throw new Error('No authentication token found');
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
            };
            const response = await apiClient.get(
                `${this.ENDPOINTS.FETCH_ALL_SHOPS}`,
                config
            );

            if (!response.data) {
                throw new Error('Invalid response from server');
            }
            return response.data;
        } catch (error) {
            console.error('[SHOPS_API]:', error);
            const enhancedError = new Error(
                error.response?.data?.message || error.message
            );
            enhancedError.response = error.response;
            enhancedError.status = error.response?.status;
            throw enhancedError;
        }
    },
};