<template>
  <div class="flex h-screen overflow-hidden bg-[#f3efe7] text-[#0f172a] font-sans">
    
    <!-- Mobile Slide-over Menu -->
    <div v-if="isMobileMenuOpen" class="fixed inset-0 z-50 lg:hidden">
      <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" @click="isMobileMenuOpen = false" />
      <div class="fixed inset-y-0 left-0 w-[260px] bg-[#0f172a] shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
        <SidebarContent @close="isMobileMenuOpen = false" />
      </div>
    </div>

    <!-- Desktop Sidebar -->
    <aside class="hidden lg:flex flex-col w-[260px] bg-[#0f172a] border-r border-white/8 z-40 shrink-0">
      <SidebarContent />
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col h-screen overflow-hidden relative">
      <!-- Top Navbar -->
      <header class="min-h-16 px-4 lg:px-8 py-2 flex items-center justify-between gap-3 z-10 backdrop-blur-md bg-[#f8f5ee]/90 border-b border-slate-300/40 sticky top-0 shrink-0">
        <div class="flex items-center flex-1 min-w-0">
          <div class="flex items-center lg:hidden mr-2">
            <div class="w-8 h-8 bg-slate-900 rounded-2xl flex items-center justify-center shadow-sm shadow-slate-300">
              <Dumbbell class="h-3.5 w-3.5 text-white" />
            </div>
          </div>
          <div class="hidden sm:flex items-center bg-white/80 rounded-full px-4 py-2 border border-slate-300/50 w-72 focus-within:bg-white focus-within:border-slate-950/20 focus-within:ring-2 focus-within:ring-slate-900/5 transition-all shadow-sm">
            <Search class="h-3.5 w-3.5 text-slate-400 mr-2 shrink-0" />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              class="bg-transparent border-none outline-none text-[11px] w-full text-slate-700 placeholder-slate-400 font-medium"
            />
          </div>
        </div>

        <div class="flex items-center shrink-0 space-x-2 sm:space-x-4">
          <div
            class="flex items-center bg-white/90 rounded-full p-1 pr-1 sm:pr-3 shadow-sm border border-slate-300/50 cursor-default hover:shadow-md transition-all max-w-[min(100%,20rem)] sm:max-w-[min(100%,22rem)]"
            :title="authStore.user?.role === 'controller' && authStore.user?.gymName ? `${authStore.user.username} — ${authStore.user.gymName}` : (authStore.user?.username || '')"
          >
            <div class="w-7 h-7 rounded-full bg-slate-900 flex items-center justify-center text-white text-[10px] font-bold uppercase shadow-sm shrink-0">
              {{ authStore.user?.username?.charAt(0) || 'G' }}
            </div>
            <div class="ml-2 mr-2 hidden sm:block text-left min-w-0 flex-1">
              <p class="text-[11px] font-bold text-slate-700 leading-snug break-words [overflow-wrap:anywhere]" :title="authStore.user?.username || 'Gérant'">{{ authStore.user?.username || 'Gérant' }}</p>
              <template v-if="authStore.user?.role === 'controller' && authStore.user?.gymName">
                <p class="text-[8px] font-bold text-slate-500 leading-snug mt-0.5 break-words [overflow-wrap:anywhere]" :title="authStore.user.gymName">{{ authStore.user.gymName }}</p>
              </template>
              <p v-else class="text-[8px] font-bold text-slate-400 uppercase tracking-[0.22em] leading-tight mt-0.5">
                {{ authStore.user?.role === 'admin' ? 'Administrateur' : authStore.user?.role === 'cashier' ? 'Caissier' : authStore.user?.role === 'controller' ? 'Contrôleur' : 'Personnel' }}
              </p>
            </div>
            <button
              @click="handleLogout"
              class="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0 ml-1 sm:ml-0"
              title="Déconnexion"
            >
              <LogOut class="h-3 w-3" />
            </button>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto p-3 pb-20 lg:p-8 lg:pb-8">
        <router-view />
      </main>

      <!-- Mobile Bottom Navigation -->
      <div class="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0f172a] border-t border-white/10 flex justify-around items-center h-14 z-40 pb-safe shadow-[0_-4px_18px_-8px_rgba(0,0,0,0.35)]">
        <router-link to="/" :class="cn('flex flex-col items-center justify-center w-full h-full transition-colors', $route.path === '/' ? 'text-cyan-300' : 'text-white/45 hover:text-white')">
          <LayoutDashboard class="h-4 w-4 mb-0.5" />
          <span class="text-[9px] font-bold">Accueil</span>
        </router-link>
        <router-link to="/members" :class="cn('flex flex-col items-center justify-center w-full h-full transition-colors', $route.path === '/members' ? 'text-cyan-300' : 'text-white/45 hover:text-white')">
          <Users class="h-4 w-4 mb-0.5" />
          <span class="text-[9px] font-bold">Membres</span>
        </router-link>
        <router-link to="/access" :class="cn('flex flex-col items-center justify-center w-full h-full transition-colors', $route.path === '/access' ? 'text-cyan-300' : 'text-white/45 hover:text-white')">
          <QrCode class="h-4 w-4 mb-0.5" />
          <span class="text-[9px] font-bold">Scan</span>
        </router-link>
        <button @click="isMobileMenuOpen = true" class="flex flex-col items-center justify-center w-full h-full text-white/45 hover:text-white transition-colors">
          <Menu class="h-4 w-4 mb-0.5" />
          <span class="text-[9px] font-bold">Menu</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { Dumbbell, Users, QrCode, LogOut, LayoutDashboard, Search, Menu } from 'lucide-vue-next';
import { cn } from '../lib/utils';
import SidebarContent from './SidebarContent.vue';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const isMobileMenuOpen = ref(false);

const handleLogout = () => {
  const isSuper = authStore.user?.role === 'superadmin';
  authStore.logout();
  router.push(isSuper ? '/super' : '/login');
};
</script>
