<template>
  <v-app dark>
    <div v-if="connectionStatus !== 'online'" class="connection-container">
      <div class="connection-banner" :class="connectionStatus">
        <v-icon left>
          {{ connectionStatusIcon }}
        </v-icon>
        <span>&nbsp;{{ connectionStatusText }}</span>
      </div>
    </div>
    <v-main>
      <template v-if="!isNotFoundPage">
        <v-app-bar v-if="showMenu" prominent>
          <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
          <span><strong>{{ authStore.shopName }}</strong></span>
          <v-spacer></v-spacer>
          <v-btn class="ms-0" icon>
            <v-icon @click="toSettings">mdi-account-circle-outline</v-icon>
          </v-btn>
        </v-app-bar>
        <v-navigation-drawer class="h-screen pa-3" v-model="drawer" v-if="showSidebar">
          <v-list density="compact" nav>
            <v-list-subheader size="30">Menu</v-list-subheader>
            <v-list-item prepend-icon="mdi-account-cash-outline" @click="toAllStore" class="ps-3"
              style="border-radius: 30px;">Stores</v-list-item>
            <v-list-item prepend-icon="mdi-cog-outline" @click="toSettings" class="ps-3"
              style="border-radius: 30px;">Settings</v-list-item>
            <v-list-item prepend-icon="mdi-door-open" @click="showLogout" class="ps-3" style="border-radius: 30px;">Sign
              Out</v-list-item>
          </v-list>
        </v-navigation-drawer>
      </template>
      <v-layout>
        <router-view />
        <GlobalLoader />
      </v-layout>
    </v-main>
  </v-app>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useLoadingStore } from '@/stores/loading';
import { useRoute } from 'vue-router';
import GlobalLoader from '@/components/GlobalLoader.vue';

export default {
  name: 'App',
  data() {
    return {
      stocks: [],
    }
  },
  components: {
    GlobalLoader,
  },
  setup() {
    const authStore = useAuthStore();
    const loadingStore = useLoadingStore();
    const connectionStatus = ref('online');
    const route = useRoute();
    const isNotFoundPage = computed(() => route.name === 'NotFound');

    const updateStatus = () => {
      if (!navigator.onLine) {
        connectionStatus.value = 'offline';
      } else {
        connectionStatus.value = 'online';
      }
    };

    let waitingTimeout;
    const simulateWaiting = () => {
      connectionStatus.value = 'waiting';
      waitingTimeout = setTimeout(() => {
        connectionStatus.value = navigator.onLine ? 'online' : 'offline';
      }, 3000);
    };

    onMounted(() => {
      window.addEventListener('online', updateStatus);
      window.addEventListener('offline', updateStatus);

      simulateWaiting();

      if ('connection' in navigator) {
        navigator.connection.addEventListener('change', () => {
          if (navigator.connection.downlink < 1) {
            connectionStatus.value = 'slow';
          } else if (navigator.onLine) {
            connectionStatus.value = 'online';
          }
        });
      }
    });

    onBeforeUnmount(() => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
      if (waitingTimeout) clearTimeout(waitingTimeout);
    });

    const connectionStatusText = computed(() => {
      switch (connectionStatus.value) {
        case 'offline':
          return 'No internet connection';
        case 'slow':
          return 'Low internet connection';
        case 'waiting':
          return 'Waiting for connection...';
        default:
          return '';
      }
    });

    const connectionStatusIcon = computed(() => {
      switch (connectionStatus.value) {
        case 'offline':
          return 'mdi-wifi-off';
        case 'slow':
          return 'mdi-wifi-alert';
        case 'waiting':
          return 'mdi-timer-sand';
        default:
          return '';
      }
    });

    return {
      authStore,
      loadingStore,
      drawer: ref(true),
      open: ref(false),
      connectionStatus,
      connectionStatusText,
      connectionStatusIcon,
      isNotFoundPage,
    };
  },
  computed: {
    showSidebar() {
      return this.$route.name !== 'LoginPage' && this.$route.name !== 'Reference' && !this.isNotFoundPage;
    },
    showMenu() {
      return this.$route.name !== 'LoginPage' && this.$route.name !== 'Reference' && !this.isNotFoundPage;
    },
  },
  methods: {
    toAllStore() {
      this.$router.push('/stores');
    },
    toSettings() {
      this.$router.push('/settings');
    },
    async showLogout() {
      this.drawer = false;
      await this.authStore.logout();
    },
  }
};
</script>

<style scoped>
.v-badge__badge {
  font-weight: 700 !important;
  padding: 2px 4px !important;
  min-width: 0 !important;
}
</style>