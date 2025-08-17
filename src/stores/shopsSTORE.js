import { defineStore } from 'pinia';
import { SHOPS_API } from '@/api/shopsAPI';

export const useFetchingShops = defineStore('shopsData', {
    state: () => ({
        shopsData: [],
        loading: false,
        error: null,
    }),

    actions: {

        async fetchShopsFromStore() {
            this.loading = true;
            this.error = null;
            try {
                if (!SHOPS_API || typeof SHOPS_API.fetchStoresApi !== 'function') {
                    throw new Error('SHOPS_API service is not properly initialized');
                }
                const response = await SHOPS_API.fetchStoresApi();
                if (response && response.status === true) {
                    this.shopsData = response.data;
                } else {
                    throw new Error('Failed to fetch shopsData');
                }
            } catch (error) {
                console.error(error);
                throw new Error(error);
            } finally {
                this.loading = false;
            }
        },

    },
});