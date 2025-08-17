<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <v-container>
        <v-btn @click="this.fetchAllShops" color="#0090b6" class="refresh" variant="flat" icon>
            <v-icon>mdi-refresh</v-icon>
        </v-btn>
        <h3>All Stores</h3>
        <v-card class="mt-3">
            <v-card-text>
                <v-data-table 
                    :headers="headersAllShops" 
                    :items="allShops" 
                    :loading="loadingAllShops"
                    density="comfortable" 
                    height="400px">

                <!--eslint-disable-next-line -->
                <template v-slot:item.shop_name="{ item }">
                    <v-chip :color="item.shop_name_id === 1 ? 'red' : 'green'" size="small" variant="tonal">
                        {{ item.shop_name }}
                    </v-chip>
                </template>
                </v-data-table>
            </v-card-text>
        </v-card>
    </v-container>
    <Alert ref="alertRef" />
</template>

<script>
import { useFetchingShops } from '@/stores/shopsSTORE';
import { useLoadingStore } from '@/stores/loading';
import Alert from '@/components/Alert.vue';

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Stores',
    components: {
        Alert,
    },
    data () {
        return {
            loadingAllShops: false,
            allShops: [],
            headersAllShops: [
                { title: 'Shop name', value: 'shop_name', width: '10%' },
                { title: 'Owner', value: 'shop_owner', width: '20%' },
                { title: 'Contact', value: 'shop_contact_number', width: '20%' },
                { title: 'Location', value: 'shop_location', width: '30%' },
                { title: 'Date created', value: 'created_at', width: '30%' },
            ],
        }
    },
    setup() {
        const shopsStore = useFetchingShops();
        const loadingStore = useLoadingStore();
        const currentDate = new Date().toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
        const formatCurrentDate = currentDate.replace(/,/g, '');
        return { shopsStore, loadingStore, formatCurrentDate };
    },
    mounted () {
        this.fetchAllShops();
    },
    methods: {
        async fetchAllShops() {
            this.loadingAllShops = true;
            this.loadingStore.show('');
            try {
                await this.shopsStore.fetchShopsFromStore();
                this.allShops = this.shopsStore.shopsData.map(shop => this.formatAllShops(shop));
            } catch (error) {
                console.error(error);
                this.showAlert(error);
            } finally {
                this.loadingAllShops = false;
                this.loadingStore.hide();
            }
        },

        formatAllShops(shop) {
            return {
                ...shop,
                created_at: shop.created_at ? this.formatDateTime(shop.created_at) : 'N/A',
            };
        },
        formatDateTime(dateString) {
            if (!dateString) return 'N/A';
            const date = new Date(dateString);
            return date.toLocaleString('en-PH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Asia/Manila'
            });
        },
        showAlert(message) {
            this.$refs.alertRef.showSnackbarAlert(message, "error");
        },
    }
};
</script>

<style scoped>
.refresh {
    position: fixed;
    bottom: 15px;
    right: 15px;
    z-index: 1;
}
</style>